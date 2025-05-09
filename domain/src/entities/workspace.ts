import {type TCreatable, type TIndexable, type TRemovable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';

export type TWorkspace = TWorkspace.System & TWorkspace.Fields;
export namespace TWorkspace {
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
  export const swagger = Swagger.object<TWorkspace>({
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
      id: Swagger.uuid({description: "Workspace's primary key"}),
      updatedAt: Swagger.date({description: "Workspace's update date"}),
      createdAt: Swagger.date({description: "Workspace's creation date"}),
      removedAt: Swagger.date({description: "Workspace's removedAt date"}),
      link: Swagger.url({description: "Workspace's link in greendocs"}),
      submenuSelector: Swagger.string({description: "Workspace's HTML selector of submenu in sidebar"}),
      suppliersExtractionAt: Swagger.date({description: "Workspace's extraction date"}),
      suppliersViewLink: Swagger.url({description: "Workspace's Link to page with supplier list"}),
      reserveViewLink: Swagger.url({description: "Workspace's link to page related reserve list"}),
      greendocsId: Swagger.integer({description: "Extracted 'id' from greendocs"}),
      greendocsName: Swagger.string({description: "Extracted 'name' from greendocs"}),
    },
  });
}
