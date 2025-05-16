import {ERole} from '#/enums';
import {type TCreatable, type TIndexable, type TRemovable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';

export type TUser = TUser.System & TUser.Fields;
export namespace TUser {
  export type System = TIndexable & TCreatable & TUpdatable & TRemovable;
  export type Fields = {
    /** @type {EMAIL} */
    email: string;
    /** @type {ENUM[Role]} */
    role: ERole;
  };
  export const swagger = Swagger.object<TUser>({
    required: ['email', 'id', 'role', 'updatedAt'],
    properties: {
      id: Swagger.uuid({description: "User's primary key"}),
      updatedAt: Swagger.date({description: "User's update date"}),
      createdAt: Swagger.date({description: "User's creation date"}),
      removedAt: Swagger.date({description: "User's removal date"}),
      email: Swagger.email({description: "User's email"}),
      role: Swagger.enum({description: "User's role", enum: Object.values(ERole)}),
    },
  });
}
