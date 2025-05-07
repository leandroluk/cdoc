import {ERole, TOtp, TOtpAuth, TUser} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import crypto from 'crypto';
import {CommonEnv} from 'libs/common';
import {CryptoService} from 'libs/crypto';
import {CredentialEntity, DatabaseService, OtpEntity, ProfileEntity, UserEntity} from 'libs/database';
import {StreamService, UserOtpUpdatedEvent} from 'libs/stream';
import ms from 'ms';
import {EntityManager} from 'typeorm';
import {uuidv7} from 'uuidv7';

@Injectable()
export class OtpAuthService implements TOtpAuth {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly commonEnv: CommonEnv,
    private readonly databaseService: DatabaseService,
    private readonly streamService: StreamService
  ) {}

  protected async getUser(entityManager: EntityManager, email: TUser['email']): Promise<TUser> {
    let user = await entityManager.getRepository(UserEntity).findOne({where: {email}});
    if (!user) {
      const now = new Date();
      user = await entityManager.getRepository(UserEntity).save({
        id: uuidv7(),
        updatedAt: now,
        createdAt: now,
        removedAt: null,
        email,
        kind: ERole.Member,
        Otp: entityManager.getRepository(OtpEntity).create({
          id: uuidv7(),
          updatedAt: now,
          expiresAt: new Date(Date.now() + ms(this.commonEnv.otpExpiresTime)),
          code: crypto.randomUUID().replace(/\W/g, '').toUpperCase().slice(0, 6),
        }),
        Credential: entityManager.getRepository(CredentialEntity).create({
          id: uuidv7(),
          updatedAt: now,
          password: this.cryptoService.createHash(crypto.randomUUID().replace(/\W/g, '-').slice(0, 50)),
          isActive: false,
        }),
        Profile: entityManager.getRepository(ProfileEntity).create({
          id: uuidv7(),
          updatedAt: now,
          givenName: null,
          familyName: null,
          picture: null,
          cover: null,
          locale: this.commonEnv.userDefaultLocale,
          theme: this.commonEnv.userDefaultTheme,
          timezone: 'UTC',
        }),
      });
    }
    return user;
  }

  protected async updateOtp(entityManager: EntityManager, userId: TUser['id']): Promise<{otp: TOtp; user: TUser}> {
    const otpRepository = entityManager.getRepository(OtpEntity);
    const {User: user, ...otp} = await otpRepository.findOneOrFail({where: {userId}});
    otp.expiresAt = new Date(Date.now() + ms(this.commonEnv.otpExpiresTime));
    otp.code = Date.now().toString().slice(-6);
    await otpRepository.save(otp);
    return {user, otp};
  }

  protected async publishUserOtpUpdatedEvent(user: TUser, otp: TOtp): Promise<void> {
    await this.streamService.publish(new UserOtpUpdatedEvent({...user, Otp: otp}));
  }

  async run(data: TOtpAuth.Data): Promise<void> {
    await this.databaseService.transaction(async entityManager => {
      const user = await this.getUser(entityManager, data.body.email);
      const {otp} = await this.updateOtp(entityManager, user.id);
      await this.publishUserOtpUpdatedEvent(user, otp);
    });
  }
}
