import {GetObjectCommand, HeadBucketCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {LoggerService} from 'libs/logger';
import {Readable} from 'node:stream';
import {StorageProvider} from '../decorators';
import {StorageEnv} from '../storage.env';
import {EStorageProvider, TStorageProvider} from '../storage.types';

@StorageProvider(EStorageProvider.Aws)
export class AwsStorageProvider implements TStorageProvider {
  readonly s3Client: S3Client;

  constructor(
    private readonly storageEnv: StorageEnv,
    private readonly loggerService: LoggerService
  ) {
    this.s3Client = new S3Client({
      region: storageEnv.awsRegion,
      credentials: {
        accessKeyId: storageEnv.awsAccessKeyId,
        secretAccessKey: storageEnv.awsSecretAccessKey,
      },
    });
  }

  async connect(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({Bucket: this.storageEnv.awsS3Bucket}));
    } catch (error: any) {
      this.loggerService.error(`Failed to connect ${this.constructor.name}`, error);
      throw error;
    }
  }

  async ping(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({Bucket: this.storageEnv.awsS3Bucket}));
    } catch (error: any) {
      this.loggerService.error(`Failed to ping ${this.constructor.name}`, error);
      throw error;
    }
  }

  async write(filePath: string, stream: Readable): Promise<void> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }

    const fileBuffer = Buffer.concat(chunks);

    const command = new PutObjectCommand({
      Bucket: this.storageEnv.awsS3Bucket,
      Key: filePath.replace(/^[\\/]/, ''),
      Body: fileBuffer,
    });

    await this.s3Client.send(command);
  }

  async read(filePath: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.storageEnv.awsS3Bucket,
      Key: filePath.replace(/^[\\/]/, ''),
    });

    const response = await this.s3Client.send(command);

    if (!response.Body || !(response.Body instanceof Readable)) {
      throw new Error('Invalid response from S3');
    }

    return response.Body;
  }
}
