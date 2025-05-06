import {type ColumnOptions, UpdateDateColumn} from 'typeorm';

export function UpdatableColumn(
  options?: Omit<ColumnOptions, 'name' | 'type' | 'precision' | 'default'> //
): PropertyDecorator {
  return function (target, propertyKey) {
    UpdateDateColumn({
      name: 'updated_at',
      type: 'timestamptz',
      precision: 3,
      ...options,
    })(target, propertyKey);
  };
}
