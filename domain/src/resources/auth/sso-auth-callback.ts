import {EProvider} from '#/enums';
import {type TSession} from '#/generics';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TSsoAuthCallback = {
  run(data: TSsoAuthCallback.Data): Promise<TSsoAuthCallback.Result>;
};
export namespace TSsoAuthCallback {
  export type Data = {
    params: Data.Params;
    query: Data.Query;
  };
  export namespace Data {
    export type Params = {
      provider: EProvider;
    };
    export namespace Params {
      export const schema = Joi.object<Params>({
        provider: Joi.string()
          .required()
          .valid(...Object.values(EProvider)),
      });
      export const swagger = Swagger.object<Params>({
        required: ['provider'],
        properties: {
          provider: Swagger.enum({description: 'The provider used to auth with SSO', enum: Object.values(EProvider)}),
        },
      });
    }
    export type Query = {
      state: string;
      code?: string;
      error?: string;
    };
    export namespace Query {
      export const schema = Joi.object<Query>({
        state: Joi.string().required(),
        code: Joi.string(),
        error: Joi.string(),
      });
      export const swagger = Swagger.object<Query>({
        required: ['state'],
        properties: {
          state: Swagger.string({description: 'State sended by application'}),
          code: Swagger.string({description: 'Code returned when success'}),
          error: Swagger.string({description: 'Error returned when failed'}),
        },
      });
    }
    export const schema = Joi.object<Data>({
      params: Params.schema,
      query: Query.schema,
    });
    export const swagger = Swagger.object<Data>({
      required: ['params', 'query'],
      properties: {
        params: Params.swagger,
        query: Query.swagger,
      },
    });
  }
  export type Result = Pick<TSession, 'id'> & {redirect: string};
}
