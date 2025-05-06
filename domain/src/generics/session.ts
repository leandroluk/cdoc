import {type TUser} from '#/entities';
import {type EProvider} from '#/enums';
import {type TIndexable} from './indexable';
import {type TOpenid} from './openid';
import {type TUpdatable} from './updatable';

export type TSession = TSession.System & TSession.Fields & TSession.Relations;
export namespace TSession {
  export type System = TIndexable & TUpdatable;
  export type Fields = {
    ssoProvider: null | EProvider;
    refreshToken: null | TOpenid.Token['refresh_token'];
  };
  export type Relations = {
    userId: TUser['id'];
  };
}
