import 'reflect-metadata';
import {Entity as TypeORMEntity, type EntityOptions} from 'typeorm';

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string | null | undefined ? K : never;
}[keyof T];

export function FullTextEntity<T extends object>(
  options: FullTextEntity.Value<T> //
): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction) {
    const {fullTextFields = [], ...restOptions} = options;
    Reflect.defineMetadata(FullTextEntity.key, fullTextFields, target);
    return TypeORMEntity(restOptions)(target);
  };
}
export namespace FullTextEntity {
  export const key = Symbol(FullTextEntity.name);
  export type Value<T extends object> = EntityOptions & {fullTextFields?: Array<StringKeys<T>>};
  export const get = <T extends object>(target: new (..._: any[]) => T): Array<StringKeys<T>> => {
    return (Reflect.getMetadata(key, target.prototype as object) as Value<T>['fullTextFields']) ?? [];
  };
}
