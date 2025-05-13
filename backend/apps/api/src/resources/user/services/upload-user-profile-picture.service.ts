import {NotFoundError, TProfile, TUploadUserProfilePicture, TUser} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {DatabaseService, ProfileEntity, UserEntity} from 'libs/database';
import {StorageService} from 'libs/storage';
import {StreamService, UserProfileUpdatedEvent} from 'libs/stream';
import {EntityManager} from 'typeorm';
import {Readable} from 'typeorm/platform/PlatformTools';

@Injectable()
export class UploadUserProfilePictureService implements TUploadUserProfilePicture<Express.Multer.File> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storageService: StorageService,
    private readonly streamService: StreamService
  ) {}

  protected async getUser(
    entityManager: EntityManager, //
    id: TUser['id']
  ): Promise<TUser> {
    const user = await entityManager.getRepository(UserEntity).findOne({where: {id}});
    if (!user) {
      throw new NotFoundError(`Cannot find User with id '${id}'`);
    }
    return user;
  }

  protected async updateProfile(
    entityManager: EntityManager,
    userId: TProfile['userId'],
    profileFields: Partial<TProfile.Fields>
  ): Promise<TProfile> {
    const repository = entityManager.getRepository(ProfileEntity);
    const oldProfile = await repository.findOneOrFail({where: {userId}});
    Object.assign(oldProfile, profileFields);
    const newProfile = await repository.save(oldProfile);
    return newProfile;
  }

  protected async publishUserProfileUpdatedEvent(user: TUser, profile: TProfile): Promise<void> {
    await this.streamService.publish(new UserProfileUpdatedEvent({...user, Profile: profile}));
  }

  async run(data: TUploadUserProfilePicture.Data<Express.Multer.File>): Promise<void> {
    await this.databaseService.transaction(async entityManager => {
      const user = await this.getUser(entityManager, data.session.userId);
      const changes: Partial<TProfile.Fields> = {};
      const readable = Readable.from(data.file.buffer);
      changes.picture = await this.storageService.saveUserPicture(user.id, readable);
      const newProfile = await this.updateProfile(entityManager, user.id, changes);
      await this.publishUserProfileUpdatedEvent(user, newProfile);
    });
  }
}
