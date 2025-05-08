import {type TGetUserProfile} from '@cdoc/domain';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {DatabaseService, ProfileEntity} from 'libs/database';

@Injectable()
export class GetUserProfileService implements TGetUserProfile {
  constructor(private readonly databaseService: DatabaseService) {}

  async run(data: TGetUserProfile.Data): Promise<TGetUserProfile.Result> {
    const result = await this.databaseService.getRepository(ProfileEntity).findOne({
      where: {userId: data.session.userId},
    });
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }
}
