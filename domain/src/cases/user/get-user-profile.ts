import {TProfile} from '#/entities';
import {type TSession} from '#/generics';

export type TGetUserProfile = {
  run(data: TGetUserProfile.Data): Promise<TGetUserProfile.Result>;
};
export namespace TGetUserProfile {
  export type Data = {
    session: TSession;
  };
  export type Result = TProfile & {};
  export namespace Result {
    export const swagger = TProfile.swagger;
  }
}
