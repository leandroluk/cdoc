import {type TCreatable, type TIndexable} from '#/generics';
import {Swagger} from '#/swagger';

export type TReceivedEmail = TReceivedEmail.System & TReceivedEmail.Fields;
export namespace TReceivedEmail {
  export type System = TIndexable & TCreatable;
  export type Fields = {
    /** @type {TEXT} */
    subject: string;
    /** @type {TEXT} */
    from: string;
    /** @type {TEXT} */
    to: string;
    /** @type {TEXT} */
    cc: string;
    /** @type {TEXT} */
    body: string;
    /** @type {TEXT} */
    attachmentList: string;
  };
  export const swagger = Swagger.object<TReceivedEmail>({
    required: ['attachmentList', 'body', 'cc', 'createdAt', 'from', 'id', 'subject', 'to'],
    properties: {
      attachmentList: Swagger.string({description: 'List of attachments on ImapEMail'}),
      body: Swagger.string({description: 'Content of ImapEmail'}),
      cc: Swagger.string({description: 'List of cc emails related with ImapEMail'}),
      createdAt: Swagger.date({description: "ImapEmail's creation date"}),
      from: Swagger.email({description: "ImapEmail's sender mail"}),
      id: Swagger.uuid({description: "ImapEmail's primary key"}),
      subject: Swagger.string({description: 'Subject of ImapEmail'}),
      to: Swagger.string({description: 'List of subjected emails related with ImapEMail'}),
    },
  });
}
