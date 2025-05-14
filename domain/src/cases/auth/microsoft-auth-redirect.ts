import {Swagger} from '#/swagger';
import Joi from 'joi';

export type TMicrosoftAuthRedirect = {
  run(data: TMicrosoftAuthRedirect.Data): Promise<string>;
};
export namespace TMicrosoftAuthRedirect {
  export type Data = {
    query: Data.Query;
  };
  export namespace Data {
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
      query: Query.schema,
    });
    export const swagger = Swagger.object<Data>({
      required: ['query'],
      properties: {
        query: Query.swagger,
      },
    });
  }
}
