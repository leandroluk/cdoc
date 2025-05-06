import {EProvider} from '#/enums';
import {type TCreatable, type TIndexable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';
import {type TUser} from './user';

export type TSso = TSso.System & TSso.Fields & TSso.Relations;
export namespace TSso {
  export type System = TIndexable & TUpdatable & TCreatable;
  export type Fields = {
    /** @type {ENUM[Provider]} */
    provider: EProvider;
    /** @type {VARCHAR[100]} */
    key: string;
  };
  export type Relations = {
    /** @type {User(id)} */
    userId: TUser['id'];
  };
  export const swagger = Swagger.object<TSso>({
    required: ['createdAt', 'id', 'key', 'provider', 'updatedAt', 'userId'],
    properties: {
      createdAt: Swagger.date({description: "Sso's creation date"}),
      id: Swagger.uuid({description: "Sso's primary key"}),
      key: Swagger.string({description: "Sso's key in provider"}),
      provider: Swagger.enum({description: "Sso's provider", enum: Object.values(EProvider)}),
      updatedAt: Swagger.date({description: "Sso's update date"}),
      userId: Swagger.date({description: "User's foreign key related with User"}),
    },
  });
}
