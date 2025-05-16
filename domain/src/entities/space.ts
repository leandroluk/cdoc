import {type TCreatable, type TIndexable, type TRemovable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';

export type TSpace = TSpace.System & TSpace.Fields;
export namespace TSpace {
  export type System = TIndexable & TUpdatable & TCreatable & TRemovable;
  export type Fields = {
    /** @type {URL} */
    link: string;
    /** @type {NULL | TEXT} */
    submenuSelector: null | string;
    /** @type {NULL | TIMESTAMP[3]} */
    suppliersExtractionAt: null | Date;
    /** @type {NULL | URL} */
    suppliersViewLink: null | string;
    /** @type {NULL | URL} */
    reserveViewLink: null | string;
    /** @type {INTEGER} */
    greendocsId: number;
    /** @type {VARCHAR[100]} */
    greendocsName: string;
  };
  export const swagger = Swagger.object<TSpace>({
    required: [
      'id',
      'updatedAt',
      'createdAt',
      'link',
      'submenuSelector',
      'suppliersExtractionAt',
      'suppliersViewLink',
      'reserveViewLink',
      'greendocsId',
      'greendocsName',
    ],
    properties: {
      id: Swagger.uuid({description: "Space's primary key"}),
      updatedAt: Swagger.date({description: "Space's update date"}),
      createdAt: Swagger.date({description: "Space's creation date"}),
      removedAt: Swagger.date({description: "Space's removedAt date"}),
      link: Swagger.url({description: "Space's link in greendocs"}),
      submenuSelector: Swagger.string({description: "Space's HTML selector of submenu in sidebar"}),
      suppliersExtractionAt: Swagger.date({description: "Space's extraction date"}),
      suppliersViewLink: Swagger.url({description: "Space's Link to page with supplier list"}),
      reserveViewLink: Swagger.url({description: "Space's link to page related reserve list"}),
      greendocsId: Swagger.integer({description: "Extracted 'id' from greendocs"}),
      greendocsName: Swagger.string({description: "Extracted 'name' from greendocs"}),
    },
  });
}
