import {Injectable} from '@nestjs/common';
import {DatabaseService, EmailEntity} from 'libs/database';
import {QueueProviderBus} from 'libs/queue';
import {StorageProviderBus} from 'libs/storage';
import {AddressObject, Attachment, EmailAddress, simpleParser} from 'mailparser';
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
export class EmailService {
  constructor(
    private readonly queueProviderBus: QueueProviderBus,
    private readonly storageProviderBus: StorageProviderBus,
    private readonly databaseService: DatabaseService
  ) {}

  private mapAddress(input?: AddressObject | AddressObject[]): string[] {
    const emailList = Array<AddressObject | undefined>()
      .concat(input)
      .flatMap(addressObject => addressObject?.value)
      .flatMap(emailAddress => Array<EmailAddress | undefined>().concat(emailAddress, emailAddress?.group))
      .flatMap(emailAddress => emailAddress?.address)
      .filter(Boolean) as string[];
    return Array.from(new Set(emailList));
  }

  private mapAttachment(input?: Attachment | Attachment[]): string[] {
    const filenameList = Array<Attachment | undefined>()
      .concat(input)
      .map(attachment => attachment?.filename)
      .filter(Boolean) as string[];
    return Array.from(new Set(filenameList));
  }

  async run(): Promise<void> {
    await this.queueProviderBus.subscribe('bot-cdoc', async (payload: Payload) => {
      const message: Payload.Message = JSON.parse(payload.Message);
      const readable = await this.storageProviderBus.read(message.receipt.action.objectKey);
      const parsed = await simpleParser(readable);
      let body = parsed.html as string;
      body ||= parsed.textAsHtml ?? parsed.text ?? '';
      await this.databaseService.getRepository(EmailEntity).save({
        id: uuidv7(),
        createdAt: new Date(),
        subject: parsed.subject,
        fromList: this.mapAddress(parsed.from),
        toList: this.mapAddress(parsed.to),
        ccList: this.mapAddress(parsed.cc),
        body,
        attachmentList: this.mapAttachment(parsed.attachments),
      });
    });
  }
}
