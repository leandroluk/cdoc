import {type TSession} from '#/generics';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TMicrosoftAuthCallback = {
  run(data: TMicrosoftAuthCallback.Data): Promise<TMicrosoftAuthCallback.Result>;
};
export namespace TMicrosoftAuthCallback {
  export type Data = {
    query: Data.Query;
  };
  export namespace Data {
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
      query: Query.schema,
    });
    export const swagger = Swagger.object<Data>({
      required: ['query'],
      properties: {
        query: Query.swagger,
      },
    });
  }
  export type Result = Pick<TSession, 'id'> & {redirect: string};
}
