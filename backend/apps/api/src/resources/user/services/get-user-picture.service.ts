import {NotFoundError, type TGetUserPicture} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {DatabaseService, ProfileEntity} from 'libs/database';
import {StorageProviderBus} from 'libs/storage';

@Injectable()
export class GetUserPictureService implements TGetUserPicture {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storageProviderBus: StorageProviderBus
  ) {}

  async run(data: TGetUserPicture.Data): Promise<TGetUserPicture.Result> {
    try {
      const profile = await this.databaseService
        .getRepository(ProfileEntity)
        .findOneOrFail({where: {userId: data.session.userId}});
      return {
        picture: profile.picture!,
        file: await this.storageProviderBus.read(profile.picture!),
      };
    } catch {
      throw new NotFoundError('File not found');
    }
  }
}
