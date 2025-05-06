import {ERole} from '#/enums';
import {type TIndexable, type TRemovable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';

export type TUser = TUser.System & TUser.Fields;
export namespace TUser {
  export type System = TIndexable & TUpdatable & TRemovable;
  export type Fields = {
    /** @type {EMAIL} */
    email: string;
    /** @type {ENUM[Role]} */
    role: ERole;
  };
  export const swagger = Swagger.object<TUser>({
    required: ['email', 'id', 'role', 'updatedAt'],
    properties: {
      email: Swagger.email({description: "User's email"}),
      id: Swagger.uuid({description: "User's primary key"}),
      removedAt: Swagger.date({description: "User's removal date"}),
      role: Swagger.enum({description: "User's role", enum: Object.values(ERole)}),
      updatedAt: Swagger.date({description: "User's update date"}),
    },
  });
}
