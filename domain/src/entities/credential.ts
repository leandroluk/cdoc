import {type TIndexable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';
import {type TUser} from './user';

export type TCredential = TCredential.System & TCredential.Fields & TCredential.Relations;
export namespace TCredential {
  export type System = TIndexable & TUpdatable;
  export type Fields = {
    /** @type {BOOLEAN} */
    isActive: boolean;
    /** @type {TEXT} */
    password: string;
  };
  export type Relations = {
    /** @type {User(id)} */
    userId: TUser['id'];
  };
  export const swagger = Swagger.object<TCredential>({
    required: ['id', 'isActive', 'password', 'updatedAt', 'userId'],
    properties: {
      id: Swagger.uuid({description: "Credential's primary key"}),
      isActive: Swagger.boolean({description: 'Defines if Credential is active'}),
      password: Swagger.string({description: 'Password related with Credential'}),
      updatedAt: Swagger.date({description: 'Last update date for Credential'}),
      userId: Swagger.uuid({description: "User's reference related with Credential"}),
    },
  });
}
