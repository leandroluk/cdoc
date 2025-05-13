import {type TSession} from '#/generics';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TUploadUserProfilePicture<T = unknown> = {
  run(data: TUploadUserProfilePicture.Data<T>): Promise<void>;
};
export namespace TUploadUserProfilePicture {
  export type Data<T = unknown> = {
    session: TSession;
    file: T;
  };
  export namespace Data {
    export const schema = Joi.object<Data>({
      file: Joi.any().required(),
    });
    export const swagger = Swagger.object<Omit<Data, 'session'>>({
      required: ['file'],
      properties: {
        file: Swagger.binary({description: 'File to upload'}),
      },
    });
  }
}
