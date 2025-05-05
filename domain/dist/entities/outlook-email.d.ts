import { type TCreatable, type TIndexable } from '../generics';
export type TOutlookEmail = TOutlookEmail.System & TOutlookEmail.Fields;
export declare namespace TOutlookEmail {
    type System = TIndexable & TCreatable;
    type Fields = {
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
