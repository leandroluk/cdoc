import {type TProfile, TUser} from '#/entities';
import {ETheme} from '#/enums';
import {type TSession} from '#/generics';
import {Swagger} from '#/swagger';

export type TGetUserWithProfile = {
  run(data: TGetUserWithProfile.Data): Promise<TGetUserWithProfile.Result>;
};
export namespace TGetUserWithProfile {
  export type Data = {
    session: TSession;
  };
  export type Result = TUser & {Profile: TProfile.Fields};
  export namespace Result {
    export const swagger = Swagger.object<Result>({
      required: ['id', 'updatedAt', 'email', 'role', 'Profile'],
      properties: {
        id: TUser.swagger.properties.id,
        updatedAt: TUser.swagger.properties.updatedAt,
        createdAt: TUser.swagger.properties.createdAt,
        removedAt: TUser.swagger.properties.removedAt,
        email: TUser.swagger.properties.email,
        role: TUser.swagger.properties.role,
        Profile: Swagger.object<TProfile.Fields>({
          required: ['theme'],
          properties: {
            givenName: Swagger.string({description: 'Given name of Profile'}),
            familyName: Swagger.string({description: 'Family name of Profile'}),
            picture: Swagger.url({description: "Profile's picture image url"}),
            theme: Swagger.enum({description: 'Theme used in application', enum: Object.values(ETheme)}),
          },
        }),
      },
    });
  }
}
