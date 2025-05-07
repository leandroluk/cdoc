import {type TCreatable, type TIndexable, type TRemovable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';
import {type TProject} from './project';

export type TSupplier = TSupplier.System & TSupplier.Fields & TSupplier.Relations;
export namespace TSupplier {
  export type System = TIndexable & TUpdatable & TCreatable & TRemovable;
  export type Fields = {
    /** @type {URL} */
    link: string;
    /** @type {INTEGER} @alias #documentos>tbody>.item["data-iddoc"] */
    greendocsDocId: number;
    /** @type {INTEGER} @alias #documentos>tbody>.item["data-idinstancia"] */
    greendocsInstanceId: number;
    /** @type {TEXT} */
    greendocsName: string;
    /** @type {TEXT} */
    greendocsSupplierName: string;
    /** @type {TEXT} */
    greendocsAddress: string;
    /** @type {TEXT} */
    greendocsCity: string;
    /** @type {TEXT} */
    greendocsState: string;
    /** @type {TEXT} */
    greendocsZipCode: string;
    /** @type {TEXT} */
    greendocsEmail: string;
    /** @type {TEXT} */
    greendocsPhone: string;
    /** @type {TEXT} */
    greendocsResponsible: string;
    /** @type {TEXT} */
    greendocsInAttentionBy: string;
    /** @type {TEXT} */
    greendocsSituation: string;
  };
  export type Relations = {
    /** @type {Project(id)} */
    projectId: TProject['id'];
  };
  export const swagger = Swagger.object<TSupplier>({
    required: [
      'id',
      'updatedAt',
      'createdAt',
      'removedAt',
      'link',
      'greendocsDocId',
      'greendocsInstanceId',
      'greendocsName',
      'greendocsSupplierName',
      'greendocsAddress',
      'greendocsCity',
      'greendocsState',
      'greendocsZipCode',
      'greendocsEmail',
      'greendocsPhone',
      'greendocsResponsible',
      'greendocsInAttentionBy',
      'greendocsSituation',
      'projectId',
    ],
    properties: {
      id: Swagger.integer({description: "Supplier's primary key"}),
      updatedAt: Swagger.date({description: "Supplier's update date"}),
      createdAt: Swagger.date({description: "Supplier's create date"}),
      removedAt: Swagger.date({description: "Supplier's remove date"}),
      link: Swagger.url({description: 'Reference link of entity in greendocs'}),
      greendocsDocId: Swagger.string({description: "Extracted 'doc id' from greendocs"}),
      greendocsInstanceId: Swagger.integer({description: "Extracted 'instance id' from greendocs"}),
      greendocsName: Swagger.string({description: "Extracted 'name' from greendocs"}),
      greendocsSupplierName: Swagger.string({description: "Extracted 'supplier name' from greendocs"}),
      greendocsAddress: Swagger.string({description: "Extracted 'address' from greendocs"}),
      greendocsCity: Swagger.string({description: "Extracted 'city' from greendocs"}),
      greendocsState: Swagger.string({description: "Extracted 'state' from greendocs"}),
      greendocsZipCode: Swagger.string({description: "Extracted 'zip code' from greendocs"}),
      greendocsEmail: Swagger.email({description: "Extracted 'email' from greendocs"}),
      greendocsPhone: Swagger.string({description: "Extracted 'phone' from greendocs"}),
      greendocsResponsible: Swagger.string({description: "Extracted 'responsible' from greendocs"}),
      greendocsInAttentionBy: Swagger.date({description: "Extracted 'in attention by' from greendocs"}),
      greendocsSituation: Swagger.string({description: "Extracted 'situation' from greendocs"}),
      projectId: Swagger.uuid({description: "Project's foreign key related with of Supplier"}),
    },
  });
}
