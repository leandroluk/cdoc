import {Injectable} from '@nestjs/common';
import {type EStorageProvider} from '../storage.types';

export function StorageProvider(storageProvider: EStorageProvider): ClassDecorator {
  return function <T extends Function>(target: T) {
    StorageProvider.map.set(storageProvider, target);
    Injectable()(target);
  };
}
export namespace StorageProvider {
  export const key = Symbol('StorageProvider');
  export const map = new Map<EStorageProvider, Function>();
  export const get = (kind: EStorageProvider): Function => map.get(kind)!;
}
