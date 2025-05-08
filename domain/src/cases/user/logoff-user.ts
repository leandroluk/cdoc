import {type TSession} from '#/generics';

export type TLogoffUser = {
  run(data: TLogoffUser.Data): Promise<void>;
};
export namespace TLogoffUser {
  export type Data = {
    session: TSession;
  };
}
