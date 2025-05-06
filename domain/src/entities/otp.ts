import {type TIndexable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';
import {type TUser} from './user';

export type TOtp = TOtp.System & TOtp.Fields & TOtp.Relations;
export namespace TOtp {
  export type System = TIndexable & TUpdatable;
  export type Fields = {
    /** @type {TIMESTAMP[3]} */
    updatedAt: Date;
    /** @type {TIMESTAMP[3]} */
    expiresAt: Date;
    /** @type {CHAR[6]} */
    code: string;
  };
  export type Relations = {
    /** @type {User(id)} */
    userId: TUser['id'];
  };
  export const swagger = Swagger.object<TOtp>({
    required: ['code', 'expiresAt', 'id', 'updatedAt', 'userId'],
    properties: {
      code: Swagger.string({description: 'Code related with OTP'}),
      expiresAt: Swagger.date({description: 'Expiration date for code in OTP'}),
      id: Swagger.uuid({description: "OTP's primary key"}),
      updatedAt: Swagger.date({description: "OTP's update date"}),
      userId: Swagger.date({description: "User's foreign key related with OTP"}),
    },
  });
}
