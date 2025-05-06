import {PrimaryColumn, type PrimaryColumnOptions} from 'typeorm';

export function IndexableColumn(
  options?: Omit<PrimaryColumnOptions, 'name' | 'type' | 'unique'> //
): PropertyDecorator {
  return function (target, propertyKey) {
    PrimaryColumn({
      name: 'id',
      type: 'uuid',
      unique: true,
      ...options,
    })(target, propertyKey);
  };
}
