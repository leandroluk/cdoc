import {EProvider, ERole, TMicrosoftAuthCallback, TOpenid, TProfile, TUser} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {CommonEnv} from 'libs/common';
import {DatabaseService, OtpEntity, ProfileEntity, SsoEntity, UserEntity} from 'libs/database';
import {SessionService} from 'libs/session';
import {StorageService} from 'libs/storage';
import {Readable} from 'node:stream';
import {EntityManager} from 'typeorm';
import {uuidv7} from 'uuidv7';

@Injectable()
export class MicrosoftAuthCallbackService implements TMicrosoftAuthCallback {
  private readonly tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
  private readonly tokenConfig = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}};

  constructor(
    private readonly commonEnv: CommonEnv,
    private readonly sessionService: SessionService,
    private readonly databaseService: DatabaseService,
    private readonly storageService: StorageService
  ) {}

  protected async getToken(code: string): Promise<TOpenid.Token> {
    const searchParams = new URLSearchParams({
      client_id: this.commonEnv.microsoftClientId,
      client_secret: this.commonEnv.microsoftClientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${this.commonEnv.apiBaseUrl}/auth/login/${EProvider.Microsoft}/callback`,
      scope: 'openid profile email offline_access User.Read',
    });
    const refreshResponse = await axios.post(this.tokenUrl, searchParams, this.tokenConfig);
    const tokenResponse = await axios.post(
      this.tokenUrl,
      new URLSearchParams({
        client_id: this.commonEnv.microsoftClientId,
        client_secret: this.commonEnv.microsoftClientSecret,
        refresh_token: refreshResponse.data.refresh_token,
        grant_type: 'refresh_token',
        scope: 'openid profile email offline_access User.Read',
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

  protected async getOpenidInfo(accessToken: TOpenid.Token['access_token']): Promise<Partial<TOpenid.Info>> {
    const headers = {Authorization: `Bearer ${accessToken}`};
    const response = await axios.get('https://graph.microsoft.com/oidc/userinfo', {headers});
    // TIP: yes, the microsoft token no returns snake_case or camelCase props
    const openidInfo: TOpenid.Info = {
      sub: response.data.sub,
      email: response.data.email,
      given_name: response.data.givenname,
      family_name: response.data.familyname,
    };
    return openidInfo;
  }

  protected async getOpenidPicture(accessToken: TOpenid.Token['access_token']): Promise<Readable> {
    const headers = {Authorization: `Bearer ${accessToken}`};
    return await axios
      .get<Readable>('https://graph.microsoft.com/v1.0/me/photo/$value', {headers, responseType: 'stream'})
      .then(({data}) => data);
  }

  protected async upsertUser(
    entityManager: EntityManager,
    openidInfo: Partial<TOpenid.Info>,
    ssoProvider: EProvider,
    openidPicture?: Readable
  ): Promise<{user: TUser; profile: TProfile}> {
    const userRepository = entityManager.getRepository(UserEntity);
    const profileRepository = entityManager.getRepository(ProfileEntity);

    const userWithRelations = await userRepository.findOne({
      where: {email: openidInfo.email},
      relations: {Profile: true},
    });

    if (userWithRelations) {
      const {Profile: profile, ...user} = userWithRelations;

      user.removedAt = null;

      profile.givenName ??= openidInfo.given_name ?? null;
      profile.familyName ??= openidInfo.family_name ?? null;
      profile.theme ??= this.commonEnv.userDefaultTheme;

      if (openidPicture) {
        profile.picture ??= await this.storageService.saveUserPicture(user.id, openidPicture);
      }

      await Promise.all([userRepository.save(user), profileRepository.save(profile)]);

      return {user, profile};
    } else {
      const userId = uuidv7();
      const now = new Date();

      let pictureUrl: string | null = null;
      if (openidPicture) {
        pictureUrl = await this.storageService.saveUserPicture(userId, openidPicture);
      }

      const user = await userRepository.save({
        id: userId,
        updatedAt: now,
        createdAt: now,
        removedAt: null,
        email: openidInfo.email,
        role: ERole.Member,
      });

      const [profile] = await Promise.all([
        profileRepository.save({
          id: uuidv7(),
          updatedAt: now,
          givenName: openidInfo.given_name ?? null,
          familyName: openidInfo.family_name ?? null,
          picture: pictureUrl,
          theme: this.commonEnv.userDefaultTheme,
          userId,
        }),
        entityManager.getRepository(OtpEntity).save({
          id: uuidv7(),
          updatedAt: now,
          code: '123456',
          expiresAt: new Date(Date.now()), // already expired
          userId,
        }),
        entityManager.getRepository(SsoEntity).save({
          id: uuidv7(),
          updatedAt: now,
          provider: ssoProvider,
          key: openidInfo.sub,
          userId,
        }),
      ]);

      return {user, profile};
    }
  }

  async run(data: TMicrosoftAuthCallback.Data): Promise<TMicrosoftAuthCallback.Result> {
    const redirect = new URL(Buffer.from(data.query.state, 'base64url').toString('utf8'));
    if (!data.query.code) {
      const {error = 'access_denied'} = data.query;
      redirect.searchParams.set('error_code', error);
      return {id: '', redirect: redirect.toString()};
    }
    return await this.databaseService.transaction(async entityManager => {
      const openidToken = await this.getToken(data.query.code as string);
      const [openidInfo, openidPicture] = await Promise.all([
        this.getOpenidInfo(openidToken.access_token),
        this.getOpenidPicture(openidToken.access_token),
      ]);
      const {user} = await this.upsertUser(entityManager, openidInfo, EProvider.Microsoft, openidPicture);
      const session = await this.sessionService.create(user, EProvider.Microsoft, openidToken);
      return {id: session.id, redirect: redirect.toString()};
    });
  }
}
