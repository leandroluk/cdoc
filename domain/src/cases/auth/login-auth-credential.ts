import {TCredential, TUser} from '#/entities';
import {type TSession} from '#/generics';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TLoginAuthCredential = {
  run(data: TLoginAuthCredential.Data): Promise<TLoginAuthCredential.Result>;
};
export namespace TLoginAuthCredential {
  export type Data = {
    body: Data.Body;
  };
  export namespace Data {
    export type Body = Pick<TUser, 'email'> & Pick<TCredential, 'password'>;
    export namespace Body {
      export const schema = Joi.object<Body>({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
      export const swagger = Swagger.object<Body>({
        required: ['email', 'password'],
        properties: {
          email: TUser.swagger.properties.email,
          password: TCredential.swagger.properties.password,
        },
      });
    }
    export const schema = Joi.object<Data>({
      body: Body.schema,
    });
    export const swagger = Swagger.object<Data>({
      required: ['body'],
      properties: {
        body: Body.swagger,
      },
    });
  }
  export type Result = Pick<TSession, 'id'>;
}
