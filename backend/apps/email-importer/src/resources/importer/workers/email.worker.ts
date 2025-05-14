import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {DatabaseService, ReceivedEmailEntity} from 'libs/database';
import {LoggerService} from 'libs/logger';
import {QueueProviderBus} from 'libs/queue';
import {StorageProviderBus} from 'libs/storage';
import {AddressObject, EmailAddress, simpleParser} from 'mailparser';
import {uuidv7} from 'uuidv7';

type Payload = {
  Message: ReturnType<typeof JSON.stringify>;
};
namespace Payload {
  export type Message = {
    receipt: {action: {objectKey: string}};
  };
}

@Injectable()
export class EmailWorker implements OnApplicationBootstrap {
  constructor(
    private readonly queueProviderBus: QueueProviderBus,
    private readonly storageProviderBus: StorageProviderBus,
    private readonly databaseService: DatabaseService,
    private readonly loggerService: LoggerService
  ) {}

  private joinAddresses(addressOrAddresses?: AddressObject | AddressObject[]): string {
    const emailList = Array<AddressObject | undefined>()
      .concat(addressOrAddresses)
      .flatMap(addressObject => addressObject?.value)
      .flatMap(emailAddress => Array<EmailAddress | undefined>().concat(emailAddress, emailAddress?.group))
      .flatMap(emailAddress => emailAddress?.address)
      .filter(Boolean);
    return [...new Set(emailList)].join(',');
  }

  async onApplicationBootstrap(): Promise<void> {
    this.run().catch((error: Error) => this.loggerService.error(`Failed to initialize. ${error.message}`));
  }

  async run(): Promise<void> {
    // > JSON.parse(JSON.parse(m.Messages[0].Body).Message).receipt.action.objectKey
    await this.queueProviderBus.subscribe('bot-cdoc', async (payload: Payload) => {
      const message: Payload.Message = JSON.parse(payload.Message);
      const readable = await this.storageProviderBus.read(message.receipt.action.objectKey);
      const parsed = await simpleParser(readable);
      require('fs').writeFileSync(`${process.cwd()}/parsed.json`, JSON.stringify(parsed, null, 2)); // eslint-disable-line @typescript-eslint/no-require-imports
      let body = parsed.html as string;
      body ||= parsed.textAsHtml ?? parsed.text ?? '';
      await this.databaseService.getRepository(ReceivedEmailEntity).save({
        id: uuidv7(),
        createdAt: new Date(),
        subject: parsed.subject,
        from: this.joinAddresses(parsed.from),
        to: this.joinAddresses(parsed.to),
        cc: this.joinAddresses(parsed.cc),
        body,
        attachmentList: (parsed.attachments || []).map(attachment => attachment.filename).filter(Boolean).join(','), // prettier-ignore
      });
    });
  }
}
