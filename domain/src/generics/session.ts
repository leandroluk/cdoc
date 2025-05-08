import {type TUser} from '#/entities';
import {type EProvider} from '#/enums';
import {Swagger} from '#/swagger';
import {type TIndexable} from './indexable';
import {type TOpenid} from './openid';
import {type TUpdatable} from './updatable';

export type TSession = TSession.System & TSession.Fields & TSession.Relations;
export namespace TSession {
  export type System = TIndexable & TUpdatable;
  export type Fields = {
    ssoProvider?: EProvider;
    refreshToken?: TOpenid.Token['refresh_token'];
  };
  export type Relations = {
    userId: TUser['id'];
  };
  export const swagger = Swagger.object<TSession>({
    required: ['id', 'updatedAt', 'userId'],
    properties: {
      id: Swagger.uuid({description: "Session's primary key"}),
      updatedAt: Swagger.date({description: 'Last update date for Session'}),
      userId: Swagger.uuid({description: "User's reference related with Session"}),
      refreshToken: Swagger.string({description: 'Refresh token related with sso provider'}),
      ssoProvider: Swagger.string({description: 'Provider related with refresh token'}),
    },
  });
}
