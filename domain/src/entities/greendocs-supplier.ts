import {type TCreatable, type TRemovable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';
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
  export const swagger = Swagger.object<TGreendocsSupplier>({
    required: [
      'address',
      'city',
      'createdAt',
      'email',
      'greendocsProjectId',
      'id',
      'inAttentionBy',
      'instanceId',
      'link',
      'name',
      'phone',
      'responsible',
      'situation',
      'state',
      'supplierName',
      'updatedAt',
      'zipCode',
    ],
    properties: {
      address: Swagger.string({description: "Extracted 'address' of GreendocsSupplier"}),
      city: Swagger.string({description: "Extracted 'city' of GreendocsSupplier"}),
      createdAt: Swagger.date({description: "GreendocsSupplier's creation date"}),
      email: Swagger.email({description: "Extracted 'email' of GreendocsSupplier"}),
      greendocsProjectId: Swagger.uuid({description: 'GreendocsProject foreign key related with of GreendocsSupplier'}),
      id: Swagger.integer({description: "GreendocsSupplier's primary key"}),
      inAttentionBy: Swagger.date({description: "Extracted in 'attention by' of GreendocsSupplier"}),
      instanceId: Swagger.integer({description: "Extracted 'instance id' of GreendocsSupplier"}),
      link: Swagger.url({description: 'Reference link in greendocs'}),
      name: Swagger.string({description: "Extracted 'name' of GreendocsSupplier"}),
      phone: Swagger.string({description: "Extracted 'phone' of GreendocsSupplier"}),
      responsible: Swagger.string({description: "Extracted 'responsible' of GreendocsSupplier"}),
      situation: Swagger.string({description: "Extracted 'situation' of GreendocsSupplier"}),
      state: Swagger.string({description: "Extracted 'state' of GreendocsSupplier"}),
      supplierName: Swagger.string({description: "Extracted 'supplier name' of GreendocsSupplier"}),
      updatedAt: Swagger.date({description: "GreendocsSupplier's update date"}),
      zipCode: Swagger.string({description: "Extracted 'zip code' of GreendocsSupplier"}),
      removedAt: Swagger.date({description: "GreendocsSupplier's removedAt date"}),
    },
  });
}
