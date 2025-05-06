import {TUser} from '#/entities';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TOtpAuth = {
  run(data: TOtpAuth.Data): Promise<void>;
};
export namespace TOtpAuth {
  export type Data = {
    body: Data.Body;
  };
  export namespace Data {
    export type Body = Pick<TUser, 'email'>;
    export namespace Body {
      export const schema = Joi.object<Body>({
        email: Joi.string().required().email({tlds: false}),
      });
      export const swagger = Swagger.object<Body>({
        required: ['email'],
        properties: {
          email: TUser.swagger.properties.email,
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
