import {NotAcceptableError, NotFoundError, TOtp, TRecoverAuth, TUser, type TCredential} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {CryptoService} from 'libs/crypto';
import {CredentialEntity, DatabaseService, UserEntity} from 'libs/database';
import {StreamService, UserCredentialUpdatedEvent} from 'libs/stream';
import {EntityManager} from 'typeorm';

@Injectable()
export class RecoverAuthService implements TRecoverAuth {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly databaseService: DatabaseService,
    private readonly streamService: StreamService
  ) {}

  protected async getUserWithRelations(
    entityManager: EntityManager,
    email: TUser['email']
  ): Promise<{user: TUser; otp: TOtp; credential: TCredential}> {
    const userWithRelations = await entityManager.getRepository(UserEntity).findOne({
      where: {email, Credential: {isActive: true}},
      relations: {Otp: true, Credential: true},
    });
    if (!userWithRelations) {
      throw new NotFoundError('Cannot find credential for change password');
    }
    const {Credential: credential, Otp: otp, ...user} = userWithRelations;
    return {user, otp, credential};
  }

  protected async changePassword(
    entityManager: EntityManager,
    credential: TCredential,
    oldPassword: string
  ): Promise<void> {
    credential.password = this.cryptoService.createHash(oldPassword);
    await entityManager.getRepository(CredentialEntity).save(credential);
  }

  protected async publishUserCredentialUpdatedEvent(user: TUser, credential: TCredential): Promise<void> {
    await this.streamService.publish(new UserCredentialUpdatedEvent({...user, Credential: credential}));
  }

  async run(data: TRecoverAuth.Data): Promise<void> {
    await this.databaseService.transaction(async entityManager => {
      const {user, credential, otp} = await this.getUserWithRelations(entityManager, data.body.email);
      if (otp.code !== data.body.code || otp.expiresAt < new Date()) {
        throw new NotAcceptableError('Invalid token');
      }
      await this.changePassword(entityManager, credential, data.body.password);
      await this.publishUserCredentialUpdatedEvent(user, credential);
    });
  }
}
