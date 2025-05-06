import {type TCreatable, type TIndexable} from '#/generics';
import {Swagger} from '#/swagger';

export type TImapEmail = TImapEmail.System & TImapEmail.Fields;
export namespace TImapEmail {
  export type System = TIndexable & TCreatable;
  export type Fields = {
    /** @type {TEXT} */
    subject: string;
    /** @type {TEXT} */
    from: string;
    /** @type {TEXT[]} */
    to: string[];
    /** @type {TEXT[]} */
    cc: string[];
    /** @type {TEXT[]} */
    bcc: string[];
    /** @type {TEXT} */
    body: string;
    /** @type {TEXT[]} */
    attachmentList: string[];
  };
  export const swagger = Swagger.object<TImapEmail>({
    required: ['attachmentList', 'bcc', 'body', 'cc', 'createdAt', 'from', 'id', 'subject', 'to'],
    properties: {
      attachmentList: Swagger.array({description: 'List of attachments on ImapEMail', items: Swagger.string()}),
      bcc: Swagger.array({description: 'List of bcc emails related with ImapEMail', items: Swagger.email()}),
      body: Swagger.string({description: 'Content of ImapEmail'}),
      cc: Swagger.array({description: 'List of cc emails related with ImapEMail', items: Swagger.email()}),
      createdAt: Swagger.date({description: "ImapEmail's creation date"}),
      from: Swagger.email({description: "ImapEmail's sender mail"}),
      id: Swagger.uuid({description: "ImapEmail's primary key"}),
      subject: Swagger.string({description: 'Subject of ImapEmail'}),
      to: Swagger.array({description: 'List of subjected emails related with ImapEMail', items: Swagger.email()}),
    },
  });
}
