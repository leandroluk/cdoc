import {NotFoundError, TOtp, TOtpAuth, TUser} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {CommonEnv} from 'libs/common';
import {CryptoService} from 'libs/crypto';
import {DatabaseService, OtpEntity, UserEntity} from 'libs/database';
import {StreamService, UserOtpUpdatedEvent} from 'libs/stream';
import ms from 'ms';
import {EntityManager} from 'typeorm';

@Injectable()
export class OtpAuthService implements TOtpAuth {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly commonEnv: CommonEnv,
    private readonly databaseService: DatabaseService,
    private readonly streamService: StreamService
  ) {}

  protected async getUser(entityManager: EntityManager, email: TUser['email']): Promise<TUser> {
    const user = await entityManager.getRepository(UserEntity).findOne({where: {email}});
    if (!user) {
      throw new NotFoundError('Could not find a user for receive email');
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
