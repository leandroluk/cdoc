import {EProvider} from '#/enums';
import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TSsoAuthRedirect = {
  run(data: TSsoAuthRedirect.Data): Promise<string>;
};
export namespace TSsoAuthRedirect {
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
        provider: Joi.string().required().valid(...Object.values(EProvider)), // prettier-ignore
      });
      export const swagger = Swagger.object<Params>({
        required: ['provider'],
        properties: {
          provider: Swagger.enum({description: 'The provider used to auth with SSO', enum: Object.values(EProvider)}),
        },
      });
    }
    export type Query = {
      redirect: string;
    };
    export namespace Query {
      export const schema = Joi.object<Query>({
        redirect: Joi.string().required().uri(),
      });
      export const swagger = Swagger.object<Query>({
        required: ['redirect'],
        properties: {
          redirect: Swagger.string({description: 'Redirection link'}),
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
}
