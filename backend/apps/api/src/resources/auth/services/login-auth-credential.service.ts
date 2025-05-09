import {TLoginAuthCredential, TOtp, TUser, type TCredential} from '@cdoc/domain';
import {Injectable, NotAcceptableException, UnauthorizedException} from '@nestjs/common';
import {CryptoService} from 'libs/crypto';
import {DatabaseService, UserEntity} from 'libs/database';
import {SessionService} from 'libs/session';
import {StreamService, UserOtpUpdatedEvent} from 'libs/stream';

@Injectable()
export class LoginAuthCredentialService implements TLoginAuthCredential {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cryptoService: CryptoService,
    private readonly streamService: StreamService,
    private readonly sessionService: SessionService
  ) {}

  protected async getUserAndRelations(
    email: TUser['email']
  ): Promise<{user: TUser; credential: TCredential; otp: TOtp} | undefined> {
    const userWithRelations = await this.databaseService
      .getRepository(UserEntity)
      .findOne({where: {email}, relations: {Credential: true, Otp: true}});
    if (userWithRelations) {
      const {Credential: credential, Otp: otp, ...user} = userWithRelations;
      return {credential, user, otp};
    }
  }

  protected async publishUserOtpUpdatedEvent(user: TUser, otp: TOtp): Promise<void> {
    await this.streamService.publish(new UserOtpUpdatedEvent({...user, Otp: otp}));
  }

  async run(data: TLoginAuthCredential.Data): Promise<TLoginAuthCredential.Result> {
    const userWithRelations = await this.getUserAndRelations(data.body.email);
    if (userWithRelations) {
      const {user, credential, otp} = userWithRelations;
      if (!credential.isActive) {
        await this.publishUserOtpUpdatedEvent(user, otp);
        throw new NotAcceptableException('User credential requires activation');
      }
      const password = this.cryptoService.createHash(data.body.password);
      if (password === credential.password) {
        const {id} = await this.sessionService.create(user);
        return {id};
      }
    }
    throw new UnauthorizedException();
  }
}
