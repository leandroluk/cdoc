import {MESSAGE, REGEX} from '#/constants';
import {TCredential, TOtp, TUser} from '#/entities';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TRecoverAuth = {
  run(data: TRecoverAuth.Data): Promise<void>;
};
export namespace TRecoverAuth {
  export type Data = {
    body: Data.Body;
  };
  export namespace Data {
    export type Body = Pick<TOtp, 'code'> & Pick<TUser, 'email'> & Pick<TCredential, 'password'>;
    export namespace Body {
      export const schema = Joi.object<Body>({
        code: Joi.string().required().length(6),
        email: Joi.string().required(),
        password: Joi.string().pattern(REGEX.PASSWORD).messages({'string.pattern.base': MESSAGE.PASSWORD}),
      });
      export const swagger = Swagger.object<Body>({
        required: ['code', 'email', 'password'],
        properties: {
          code: TOtp.swagger.properties.code,
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
}
