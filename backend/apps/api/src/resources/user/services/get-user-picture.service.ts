import {NotFoundError, type TGetUserPicture} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {DatabaseService, ProfileEntity} from 'libs/database';
import {StorageService} from 'libs/storage';

@Injectable()
export class GetUserPictureService implements TGetUserPicture {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storageService: StorageService
  ) {}

  async run(data: TGetUserPicture.Data): Promise<TGetUserPicture.Result> {
    try {
      const profile = await this.databaseService
        .getRepository(ProfileEntity)
        .findOneOrFail({where: {userId: data.session.userId}});
      return {
        picture: profile.picture!,
        file: await this.storageService.read(profile.picture!),
      };
    } catch {
      throw new NotFoundError('File not found');
    }
  }
}
