import {EProvider, ERole, TOpenid, TProfile, TSsoAuthCallback, TUser} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {CommonEnv} from 'libs/common';
import {DatabaseService, ProfileEntity, SsoEntity, UserEntity} from 'libs/database';
import {SessionService} from 'libs/session';
import {StorageService} from 'libs/storage';
import ms from 'ms';
import {Readable} from 'node:stream';
import {EntityManager} from 'typeorm';
import {uuidv7} from 'uuidv7';

abstract class Provider {
  constructor(readonly commonEnv: CommonEnv) {}

  abstract getToken(code: string): Promise<TOpenid.Token>;
  abstract getOpenidInfo(accessToken: TOpenid.Token['access_token']): Promise<Partial<TOpenid.Info>>;
  abstract getOpenidPicture(accessToken: TOpenid.Token['access_token']): Promise<Readable>;
}

@Injectable()
export class SsoAuthCallbackService implements TSsoAuthCallback {
  constructor(
    private readonly commonEnv: CommonEnv,
    private readonly sessionService: SessionService,
    private readonly databaseService: DatabaseService,
    private readonly storageService: StorageService
  ) {
    // TIP: make to add more providers when necessary
    this.map.set(EProvider.Microsoft, new SsoAuthCallbackService.MicrosoftProvider(commonEnv));
  }

  protected readonly map = new Map<EProvider, Provider>();

  protected async upsertUser(
    entityManager: EntityManager,
    openidInfo: Partial<TOpenid.Info>,
    ssoProvider: EProvider,
    openidPicture?: Readable
  ): Promise<{user: TUser; profile: TProfile}> {
    const userWithRelations = await entityManager.getRepository(ProfileEntity).findOne({
      where: {User: {email: openidInfo.email}},
      relations: {User: true},
    });

    const userId = userWithRelations?.userId ?? uuidv7();
    let pictureUrl: string | null = null;

    if (openidPicture) {
      pictureUrl = await this.storageService.saveUserPicture(userId, openidPicture);
    }

    const userRepository = entityManager.getRepository(UserEntity);
    const profileRepository = entityManager.getRepository(ProfileEntity);

    if (userWithRelations) {
      const {User: user, ...profile} = userWithRelations;

      user.removedAt = null;

      profile.givenName ??= openidInfo.given_name ?? null;
      profile.familyName ??= openidInfo.family_name ?? null;
      profile.picture ??= pictureUrl;
      profile.locale ??= openidInfo.locale ?? this.commonEnv.userDefaultLocale;
      profile.timezone ??= openidInfo.timezone ?? this.commonEnv.userDefaultTimezone;
      profile.theme ??= this.commonEnv.userDefaultTheme;

      await Promise.all([userRepository.save(user), profileRepository.save(profile)]);

      return {user, profile};
    }
    const now = new Date();

    const {Profile: profile, ...user} = userRepository.create({
      id: userId,
      updatedAt: now,
      createdAt: now,
      removedAt: null,
      email: openidInfo.email,
      role: ERole.Member,
      SsoList: [
        entityManager.getRepository(SsoEntity).create({
          id: uuidv7(),
          updatedAt: now,
          provider: ssoProvider,
          key: openidInfo.sub,
        }),
      ],
      Profile: entityManager.getRepository(ProfileEntity).create({
        id: uuidv7(),
        updatedAt: now,
        givenName: openidInfo.given_name ?? null,
        familyName: openidInfo.family_name ?? null,
        picture: pictureUrl,
        locale: this.commonEnv.userDefaultLocale,
        timezone: openidInfo.timezone ?? this.commonEnv.userDefaultTimezone,
        theme: this.commonEnv.userDefaultTheme,
      }),
    });

    return {
      user: user as TUser,
      profile,
    };
  }

  async run(data: TSsoAuthCallback.Data): Promise<TSsoAuthCallback.Result> {
    const redirect = new URL(Buffer.from(data.query.state, 'base64url').toString('utf8'));
    if (!data.query.code) {
      const {error = 'access_denied'} = data.query;
      redirect.searchParams.set('error_code', error);
      return {id: '', redirect: redirect.toString()};
    }
    return await this.databaseService.transaction(async entityManager => {
      const authProvider = this.map.get(data.params.provider)!;
      const openidToken = await authProvider.getToken(data.query.code as string);
      const [openidInfo, openidPicture] = await Promise.all([
        authProvider.getOpenidInfo(openidToken.access_token),
        authProvider.getOpenidPicture(openidToken.access_token),
      ]);
      const {user} = await this.upsertUser(entityManager, openidInfo, data.params.provider, openidPicture);
      const session = await this.sessionService.create(
        user,
        ms(this.commonEnv.refreshTtl),
        data.params.provider,
        openidToken
      );
      return {id: session.id, redirect: redirect.toString()};
    });
  }
}
export namespace SsoAuthCallbackService {
  export class MicrosoftProvider extends Provider {
    private tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    private tokenConfig = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}};

    async getToken(code: string): Promise<TOpenid.Token> {
      const refreshResponse = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          client_id: this.commonEnv.microsoftClientId,
          client_secret: this.commonEnv.microsoftClientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${this.commonEnv.apiBaseUrl}/auth/login/${EProvider.Microsoft}`,
          scope: 'openid email profile offline_access',
        }),
        this.tokenConfig
      );
      const tokenResponse = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          client_id: this.commonEnv.microsoftClientId,
          client_secret: this.commonEnv.microsoftClientSecret,
          refresh_token: refreshResponse.data.refresh_token,
          grant_type: 'refresh_token',
          scope: 'openid profile email User.Read',
        }),
        this.tokenConfig
      );
      const openidToken: TOpenid.Token = {
        access_token: tokenResponse.data.access_token,
        expires_in: tokenResponse.data.expires_in,
        id_token: tokenResponse.data.id_token,
        refresh_token: refreshResponse.data.refresh_token,
        token_type: tokenResponse.data.token_type,
      };
      return openidToken;
    }

    async getOpenidInfo(accessToken: TOpenid.Token['access_token']): Promise<Partial<TOpenid.Info>> {
      const headers = {Authorization: `Bearer ${accessToken}`};
      const response = await axios.get('https://graph.microsoft.com/oidc/userinfo', {headers});
      // TIP: yes, the microsoft token no returns snake_case or camelCase props
      const openidInfo: TOpenid.Info = {
        sub: response.data.sub,
        email: response.data.email,
        given_name: response.data.givenname,
        family_name: response.data.familyname,
        locale: this.commonEnv.userDefaultLocale,
        theme: this.commonEnv.userDefaultTheme,
        timezone: this.commonEnv.userDefaultTimezone,
      };
      return openidInfo;
    }

    async getOpenidPicture(accessToken: TOpenid.Token['access_token']): Promise<Readable> {
      const headers = {Authorization: `Bearer ${accessToken}`};
      return await axios
        .get<Readable>('https://graph.microsoft.com/v1.0/me/photo/$value', {headers, responseType: 'stream'})
        .then(({data}) => data);
    }
  }
}
