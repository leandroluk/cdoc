import {type TCreatable, type TIndexable} from '#/generics';
import {Swagger} from '#/swagger';

export type TEmail = TEmail.System & TEmail.Fields;
export namespace TEmail {
  export type System = TIndexable & TCreatable;
  export type Fields = {
    /** @type {TEXT} */
    subject: string;
    /** @type {TEXT} */
    body: string;
    /** @type {TEXT[]} */
    fromList: string[];
    /** @type {TEXT[]} */
    toList: string[];
    /** @type {TEXT[]} */
    ccList: string[];
    /** @type {TEXT[]} */
    attachmentList: string[];
  };
  export const swagger = Swagger.object<TEmail>({
    required: ['id', 'createdAt', 'subject', 'body', 'fromList', 'toList', 'ccList', 'attachmentList'],
    properties: {
      id: Swagger.uuid({description: "Email's primary key"}),
      createdAt: Swagger.date({description: "Email's creation date"}),
      subject: Swagger.string({description: 'Subject of Email'}),
      body: Swagger.string({description: 'Content of Email'}),
      fromList: Swagger.array({description: "Email's sender mail", items: Swagger.email()}),
      toList: Swagger.array({description: 'List of subjected emails related with Email', items: Swagger.email()}),
      ccList: Swagger.array({description: 'List of cc emails related with Email', items: Swagger.email()}),
      attachmentList: Swagger.array({description: 'List of attachments on Email', items: Swagger.email()}),
    },
  });
}
