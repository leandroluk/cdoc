import {type Readable} from 'stream';

export enum EStorageProvider {
  Local = 'local',
  Aws = 'aws',
}

export type TStorageProvider = {
  connect(): Promise<void>;
  ping(): Promise<void>;
  write(filePath: string, stream: Readable): Promise<void>;
  read(filePath: string): Promise<Readable>;
};
