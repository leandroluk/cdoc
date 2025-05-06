import {Injectable} from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {type Readable} from 'node:stream';
import {StorageProvider} from '../decorators';
import {StorageEnv} from '../storage.env';

@Injectable()
@StorageProvider(StorageProvider.Kind.Local)
export class LocalStorageProvider implements StorageProvider.Type {
  constructor(private readonly storageEnv: StorageEnv) {}

  private createFullFilePath(filePath: string): string {
    const fullFilePath = path.resolve(this.storageEnv.localPath, filePath.replace(/^[\\/]/, ''));
    return fullFilePath;
  }

  async write(filePath: string, stream: Readable): Promise<void> {
    const fullFilePath = this.createFullFilePath(filePath);
    const dirPath = path.dirname(fullFilePath);
    try {
      await fs.promises.access(dirPath);
    } catch {
      await fs.promises.mkdir(dirPath, {recursive: true});
    }
    await fs.promises.writeFile(fullFilePath, stream);
  }

  async read(filePath: string): Promise<Readable> {
    const fullFilePath = this.createFullFilePath(filePath);
    await fs.promises.access(fullFilePath);
    const stream = fs.createReadStream(fullFilePath);
    return stream;
  }
}
