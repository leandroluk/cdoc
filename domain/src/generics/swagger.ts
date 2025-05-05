import {type OpenAPIV3} from 'openapi-types';

export const TSwagger = {
  object: <T extends object>(
    data?: ISwagger.RequiredObject<T> //
  ): {type: 'object'} & ISwagger.RequiredObject<T> => ({type: 'object', ...data}) as {type: 'object'} & ISwagger.RequiredObject<T>,

  array: <T extends object>(
    data?: Omit<OpenAPIV3.ArraySchemaObject, 'type' | 'items'> & {
      items: ISwagger.RequiredObject<T> | OpenAPIV3.NonArraySchemaObject;
    }
  ): OpenAPIV3.ArraySchemaObject => ({type: 'array', ...data}) as OpenAPIV3.ArraySchemaObject,

  boolean: (
    data?: OpenAPIV3.NonArraySchemaObject //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'boolean', ...data}),

  number: (
    data?: OpenAPIV3.NonArraySchemaObject //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'number', ...data}),

  integer: (
    data?: OpenAPIV3.NonArraySchemaObject //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'integer', ...data}),

  string: (
    data?: OpenAPIV3.NonArraySchemaObject //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'string', ...data}),

  url: (
    data?: OpenAPIV3.NonArraySchemaObject //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'string', format: 'url', ...data}),

  enum: <T>(
    data?: Omit<OpenAPIV3.NonArraySchemaObject, 'enum'> & {enum: Array<T>} //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'string', ...data}),

  uuid: (
    data?: OpenAPIV3.NonArraySchemaObject //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'string', format: 'uuid', ...data}),

  email: (
    data?: OpenAPIV3.NonArraySchemaObject //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'string', format: 'email', ...data}),

  binary: (
    data?: OpenAPIV3.NonArraySchemaObject //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'string', format: 'binary', ...data}),

  date: (
    data?: Omit<OpenAPIV3.NonArraySchemaObject, 'type'> //
  ): OpenAPIV3.NonArraySchemaObject => ({type: 'string', format: 'date-time', ...data}),
};
export namespace ISwagger {
  export type RequiredObject<T extends object> = OpenAPIV3.BaseSchemaObject & {
    required: Array<
      keyof {
        [K in keyof T as string extends K ? never : object extends Pick<T, K> ? never : K]: 0;
      }
    >;
    properties: Record<keyof T, OpenAPIV3.SchemaObject>;
  };
}
