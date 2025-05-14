import {type EStorageProvider} from '../storage.types';

export function StorageProvider(storageProvider: EStorageProvider): ClassDecorator {
  return function <T extends Function>(target: T) {
    StorageProvider.map.set(storageProvider, target);
  };
}
export namespace StorageProvider {
  export const key = Symbol('StorageProvider');
  export const map = new Map<EStorageProvider, Function>();
  export const get = (kind: EStorageProvider): Function => map.get(kind)!;
  export enum Kind {
    Local = 'local',
    AwsS3 = 'aws-s3',
  }
}
