import {type TCreatable, type TRemovable, type TUpdatable} from '#/generics';
import {type TGreendocsProject} from './greendocs-project';

export type TGreendocsSupplier = TGreendocsSupplier.System & TGreendocsSupplier.Fields & TGreendocsSupplier.Relations;
export namespace TGreendocsSupplier {
  export type System = TUpdatable & TCreatable & TRemovable;
  export type Fields = {
    /** @type {INTEGER} @alias #documentos>tbody>.item["data-iddoc"] */
    id: number;
    /** @type {INTEGER} @alias #documentos>tbody>.item["data-idinstancia"] */
    instanceId: number;
    /** @type {URL} */
    link: string;
    /** @type {TEXT} */
    name: string;
    /** @type {TEXT} */
    supplierName: string;
    /** @type {TEXT} */
    address: string;
    /** @type {TEXT} */
    city: string;
    /** @type {TEXT} */
    state: string;
    /** @type {TEXT} */
    zipCode: string;
    /** @type {TEXT} */
    email: string;
    /** @type {TEXT} */
    phone: string;
    /** @type {TEXT} */
    responsible: string;
    /** @type {TEXT} */
    inAttentionBy: string;
    /** @type {TEXT} */
    situation: string;
  };
  export type Relations = {
    /** @type {Project(id)} */
    greendocsProjectId: TGreendocsProject['id'];
  };
}
