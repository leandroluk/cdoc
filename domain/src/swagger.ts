import {type OpenAPIV3 as O} from 'openapi-types';

type ObjectSchemaObject<T extends object> = O.BaseSchemaObject & {
  required: Array<keyof {[K in keyof T as string extends K ? never : object extends Pick<T, K> ? never : K]: 0}>;
  // prettier-ignore
  properties: {
    [K in keyof T]:
    T[K] extends Array<any> ? O.ArraySchemaObject :
    T[K] extends Date ? O.NonArraySchemaObject :
    T[K] extends object ? ObjectSchemaObject<T[K]> : O.NonArraySchemaObject
  };
};

export const Swagger = {
  object: <T extends object>(
    data?: ObjectSchemaObject<T> //
  ): {type: 'object'} & ObjectSchemaObject<T> =>
    ({type: 'object', ...data}) as {type: 'object'} & ObjectSchemaObject<T>,

  array: <T extends object>(
    data?: Omit<O.ArraySchemaObject, 'type' | 'items'> & {items: ObjectSchemaObject<T> | O.NonArraySchemaObject} //
  ): O.ArraySchemaObject => ({type: 'array', ...data}) as O.ArraySchemaObject,

  boolean: (
    data?: O.NonArraySchemaObject //
  ): O.NonArraySchemaObject => ({type: 'boolean', ...data}),

  number: (
    data?: O.NonArraySchemaObject //
  ): O.NonArraySchemaObject => ({type: 'number', ...data}),

  integer: (
    data?: O.NonArraySchemaObject //
  ): O.NonArraySchemaObject => ({type: 'integer', ...data}),

  string: (
    data?: O.NonArraySchemaObject //
  ): O.NonArraySchemaObject => ({type: 'string', ...data}),

  url: (
    data?: O.NonArraySchemaObject //
  ): O.NonArraySchemaObject => ({type: 'string', format: 'url', ...data}),

  enum: <T>(
    data?: Omit<O.NonArraySchemaObject, 'enum'> & {enum: Array<T>} //
  ): O.NonArraySchemaObject => ({type: 'string', ...data}),

  uuid: (
    data?: O.NonArraySchemaObject //
  ): O.NonArraySchemaObject => ({type: 'string', format: 'uuid', ...data}),

  email: (
    data?: O.NonArraySchemaObject //
  ): O.NonArraySchemaObject => ({type: 'string', format: 'email', ...data}),

  binary: (
    data?: O.NonArraySchemaObject //
  ): O.NonArraySchemaObject => ({type: 'string', format: 'binary', ...data}),

  date: (
    data?: Omit<O.NonArraySchemaObject, 'type'> //
  ): O.NonArraySchemaObject => ({type: 'string', format: 'date-time', ...data}),
};
