import {TGetUserWithProfile} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {DatabaseService, UserEntity} from 'libs/database';

@Injectable()
export class GetUserWithProfileService implements TGetUserWithProfile {
  constructor(private readonly databaseService: DatabaseService) {}

  async run(data: TGetUserWithProfile.Data): Promise<TGetUserWithProfile.Result> {
    const userWithRelations = await this.databaseService.getRepository(UserEntity).findOneOrFail({
      where: {id: data.session.userId},
      relations: {Profile: true},
    });
    return {
      id: userWithRelations.id,
      updatedAt: userWithRelations.updatedAt,
      createdAt: userWithRelations.createdAt,
      removedAt: userWithRelations.removedAt,
      email: userWithRelations.email,
      role: userWithRelations.role,
      Profile: {
        familyName: userWithRelations.Profile.familyName,
        givenName: userWithRelations.Profile.givenName,
        picture: userWithRelations.Profile.picture,
        theme: userWithRelations.Profile.theme,
      },
    };
  }
}
