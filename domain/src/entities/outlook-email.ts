import {type TCreatable, type TIndexable} from '#/generics';

export type TOutlookEmail = TOutlookEmail.System & TOutlookEmail.Fields;
export namespace TOutlookEmail {
  export type System = TIndexable & TCreatable;
  export type Fields = {
    /** @type {TEXT} */
    messageId: string;
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
}
