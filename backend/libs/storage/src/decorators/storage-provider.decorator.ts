import {type Readable} from 'node:stream';

export function StorageProvider(kind: StorageProvider.Kind): ClassDecorator {
  return function <T extends Function>(target: T) {
    StorageProvider.map.set(kind, target);
  };
}
export namespace StorageProvider {
  export const key = Symbol('StorageProvider');
  export const map = new Map<StorageProvider.Kind, Function>();
  export const get = (kind: StorageProvider.Kind): Function => map.get(kind)!;
  export type Type = {
    write(filePath: string, stream: Readable): Promise<void>;
    read(filePath: string): Promise<Readable>;
  };
  export enum Kind {
    Local = 'local',
  }
}
