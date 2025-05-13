import {ETheme} from '#/enums';
import {type TIndexable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';
import {type TUser} from './user';

export type TProfile = TProfile.System & TProfile.Fields & TProfile.Relations;
export namespace TProfile {
  export type System = TIndexable & TUpdatable;
  export type Fields = {
    /** @type {NULL | VARCHAR[100]} */
    givenName: null | string;
    /** @type {NULL | VARCHAR[100]} */
    familyName: null | string;
    /** @type {NULL | TEXT} */
    picture: null | string;
    /** @type {ENUM[Theme]} */
    theme: ETheme;
  };
  export type Relations = {
    /** @type {User(id)} */
    userId: TUser['id'];
  };
  export const swagger = Swagger.object<TProfile>({
    required: ['id', 'updatedAt', 'theme'],
    properties: {
      familyName: Swagger.string({description: 'Family name of Profile'}),
      givenName: Swagger.string({description: 'Given name of Profile'}),
      id: Swagger.uuid({description: "Profile's primary key"}),
      picture: Swagger.url({description: "Profile's picture image url"}),
      theme: Swagger.enum({description: 'Theme used in application', enum: Object.values(ETheme)}),
      updatedAt: Swagger.date({description: "Profile's update date"}),
      userId: Swagger.date({description: "User's foreign key related with User"}),
    },
  });
}
