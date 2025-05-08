import {TProfile, TUser, type TUpdateUserProfile} from '@cdoc/domain';
import {Injectable, NotFoundException} from '@nestjs/common';
import axios from 'axios';
import {DatabaseService, ProfileEntity, UserEntity} from 'libs/database';
import {StorageService} from 'libs/storage';
import {StreamService, UserProfileUpdatedEvent} from 'libs/stream';
import {EntityManager} from 'typeorm';

@Injectable()
export class UpdateUserProfileService implements TUpdateUserProfile {
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
      throw new NotFoundException(`Cannot find User with id '${id}'`);
    }
    return user;
  }

  protected async savePicture(
    id: TUser['id'], //
    body: TUpdateUserProfile.Data.Body
  ): Promise<string | undefined> {
    if (body.pictureUrl?.startsWith('http')) {
      return await axios
        .get(body.pictureUrl, {responseType: 'stream'})
        .then(response => this.storageService.saveUserPicture(id, response.data));
    }
  }

  protected async saveCover(
    id: TUser['id'], //
    body: TUpdateUserProfile.Data.Body
  ): Promise<string | undefined> {
    if (body.coverUrl?.startsWith('http')) {
      return await axios
        .get(body.coverUrl, {responseType: 'stream'})
        .then(response => this.storageService.saveUserCover(id, response.data));
    }
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

  async run(data: TUpdateUserProfile.Data): Promise<void> {
    await this.databaseService.transaction(async entityManager => {
      const user = await this.getUser(entityManager, data.session.userId);
      const newProfile = await this.updateProfile(entityManager, user.id, {
        familyName: data.body.familyName,
        givenName: data.body.givenName,
        locale: data.body.locale,
        theme: data.body.theme,
        timezone: data.body.timezone,
        picture: await this.savePicture(user.id, data.body),
        cover: await this.saveCover(user.id, data.body),
      });
      await this.publishUserProfileUpdatedEvent(user, newProfile);
    });
  }
}
