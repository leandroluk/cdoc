import {type ColumnOptions, DeleteDateColumn} from 'typeorm';

export function RemovableColumn(
  options?: Omit<ColumnOptions, 'name' | 'type' | 'precision' | 'default' | 'nullable'> //
): PropertyDecorator {
  return function (target, propertyKey) {
    DeleteDateColumn({
      name: 'removed_at',
      type: 'timestamptz',
      precision: 3,
      nullable: true,
      ...options,
    })(target, propertyKey);
  };
}
