import {type ColumnOptions, CreateDateColumn} from 'typeorm';

export function CreatableColumn(
  options?: Omit<ColumnOptions, 'name' | 'type' | 'precision' | 'default'> //
): PropertyDecorator {
  return function (target, propertyKey) {
    CreateDateColumn({
      name: 'created_at',
      type: 'timestamptz',
      precision: 3,
      ...options,
    })(target, propertyKey);
  };
}
