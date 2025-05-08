import {type TSession} from '#/generics';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TUploadUserProfileFile<T = unknown> = {
  run(data: TUploadUserProfileFile.Data<T>): Promise<void>;
};
export namespace TUploadUserProfileFile {
  export type Data<T = unknown> = {
    session: TSession;
    params: Data.Params;
    body: Data.Body<T>;
  };
  export namespace Data {
    export type Params = {
      file: 'picture' | 'cover';
    };
    export namespace Params {
      export const schema = Joi.object<Params>({
        file: Joi.string().required().valid('picture', 'cover'),
      });
      export const swagger = Swagger.object<Params>({
        required: ['file'],
        properties: {
          file: Swagger.enum({description: 'File to be uploaded', enum: ['picture', 'cover']}),
        },
      });
    }
    export type Body<T = any> = {
      file: T;
    };
    export namespace Body {
      export const schema = Joi.object<Body>({
        file: Joi.any().required(),
      });
      export const swagger = Swagger.object<Body>({
        required: ['file'],
        properties: {
          file: Swagger.binary({description: 'File to upload'}),
        },
      });
    }
  }
}
