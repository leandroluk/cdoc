import {type Readable} from 'stream';

export enum EStorageProvider {
  Local = 'local',
  AwsS3 = 'aws-s3',
}

export type TStorageProvider = {
  write(filePath: string, stream: Readable): Promise<void>;
  read(filePath: string): Promise<Readable>;
  ping(): Promise<void>;
};
