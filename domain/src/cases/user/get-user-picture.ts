import {type TProfile} from '#/entities';
import {type TSession} from '#/generics';
import {type Readable} from 'stream';

export type TGetUserPicture = {
  run(data: TGetUserPicture.Data): Promise<TGetUserPicture.Result>;
};
export namespace TGetUserPicture {
  export type Data = {
    session: TSession;
  };
  export type Result = {
    picture: Exclude<TProfile['picture'], null>;
    file: Readable;
  };
}
