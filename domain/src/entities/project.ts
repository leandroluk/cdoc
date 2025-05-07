import {type TCreatable, type TIndexable, type TRemovable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';

export type TProject = TProject.System & TProject.Fields;
export namespace TProject {
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
  export const swagger = Swagger.object<TProject>({
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
      id: Swagger.uuid({description: "Project's primary key"}),
      updatedAt: Swagger.date({description: "Project's update date"}),
      createdAt: Swagger.date({description: "Project's creation date"}),
      removedAt: Swagger.date({description: "Project's removedAt date"}),
      link: Swagger.url({description: "Project's link in greendocs"}),
      submenuSelector: Swagger.string({description: "Project's HTML selector of submenu in sidebar"}),
      suppliersExtractionAt: Swagger.date({description: "Project's extraction date"}),
      suppliersViewLink: Swagger.url({description: "Project's Link to page with supplier list"}),
      reserveViewLink: Swagger.url({description: "Project's link to page related reserve list"}),
      greendocsId: Swagger.integer({description: "Extracted 'id' from greendocs"}),
      greendocsName: Swagger.string({description: "Extracted 'name' from greendocs"}),
    },
  });
}
