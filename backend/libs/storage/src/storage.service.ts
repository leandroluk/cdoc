import {TUser} from '@cdoc/domain';
import {Injectable} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {Jimp, JimpMime} from 'jimp';
import {Readable} from 'node:stream';
import {StorageProvider} from './decorators';
import {StorageEnv} from './storage.env';

@Injectable()
export class StorageService implements StorageProvider.Type {
  readonly defaultProvider: StorageProvider.Kind;

  constructor(
    private readonly storageEnv: StorageEnv,
    private readonly moduleRef: ModuleRef
  ) {}

  async write(filePath: string, stream: Readable, kind?: StorageProvider.Kind): Promise<void> {
    return this.moduleRef
      .get<StorageProvider.Type>(StorageProvider.get(kind ?? this.storageEnv.provider))
      .write(filePath, stream);
  }

  async read(filePath: string, kind?: StorageProvider.Kind): Promise<Readable> {
    return this.moduleRef
      .get<StorageProvider.Type>(StorageProvider.get(kind ?? this.storageEnv.provider))
      .read(filePath);
  }

  async saveUserPicture(userId: TUser['id'], readable: Readable, kind?: StorageProvider.Kind): Promise<string> {
    const size = this.storageEnv.userPictureSize;

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      readable.on('data', chunk => chunks.push(chunk));
      readable.on('end', () => resolve(Buffer.concat(chunks)));
      readable.on('error', reject);
    });

    const image = await Jimp.read(buffer);
    image.resize({w: size, h: size});

    const pngBuffer = await image.getBuffer(JimpMime.png);
    const resizedReadable = Readable.from(pngBuffer);

    const template = Handlebars.compile(this.storageEnv.userPictureUrl);
    const picturePath = template({userId, ext: 'png'});

    await this.write(picturePath, resizedReadable, kind);
    return picturePath;
  }
}
