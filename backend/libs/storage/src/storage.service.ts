import {TUser} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import Handlebars from 'handlebars';
import {Jimp, JimpMime} from 'jimp';
import {Readable} from 'node:stream';
import {StorageProvider} from './decorators';
import {StorageEnv} from './storage.env';
import {TStorageProvider} from './storage.types';

@Injectable()
export class StorageService implements TStorageProvider {
  readonly provider: TStorageProvider;

  constructor(
    private readonly storageEnv: StorageEnv,
    private readonly moduleRef: ModuleRef
  ) {
    this.provider = this.moduleRef.get<TStorageProvider>(StorageProvider.get(storageEnv.provider));
  }

  //#region TStorageProvider implementation

  async write(filePath: string, stream: Readable): Promise<void> {
    return await this.provider.write(filePath, stream);
  }

  async read(filePath: string): Promise<Readable> {
    return await this.provider.read(filePath);
  }

  async ping(): Promise<void> {
    return await this.provider.ping();
  }

  //#endregion

  //#region extended methods

  async saveUserPicture(userId: TUser['id'], readable: Readable): Promise<string> {
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks = Array<Buffer>();
      readable.on('data', chunk => chunks.push(chunk));
      readable.on('end', () => resolve(Buffer.concat(chunks)));
      readable.on('error', reject);
    });

    const image = await Jimp.read(buffer);
    image.resize({w: this.storageEnv.userPictureSize, h: this.storageEnv.userPictureSize});

    const pngBuffer = await image.getBuffer(JimpMime.png);
    const resizedReadable = Readable.from(pngBuffer);
    const picturePath = Handlebars.compile(this.storageEnv.userPictureUrl)({userId, ext: 'png'});

    await this.write(picturePath, resizedReadable);
    return picturePath;
  }

  //#endregion
}
