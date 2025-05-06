import {type TCreatable, type TRemovable, type TUpdatable} from '#/generics';
import {Swagger} from '#/swagger';

export type TGreendocsProject = TGreendocsProject.System & TGreendocsProject.Fields;
export namespace TGreendocsProject {
  export type System = TUpdatable & TCreatable & TRemovable;
  export type Fields = {
    /** @type {INTEGER} */
    id: number;
    /** @type {URL} */
    link: string;
    /** @type {VARCHAR[100]} */
    name: string;
    /** @type {NULL | TEXT} */
    submenuSelector: null | string;
    /** @type {NULL | TIMESTAMP[3]} */
    suppliersExtractionAt: null | Date;
    /** @type {NULL | URL} */
    suppliersViewLink: null | string;
    /** @type {NULL | URL} */
    reserveViewLink: null | string;
  };
  export const swagger = Swagger.object<TGreendocsProject>({
    required: [
      'createdAt',
      'id',
      'link',
      'name',
      'reserveViewLink',
      'submenuSelector',
      'suppliersExtractionAt',
      'suppliersViewLink',
      'updatedAt',
    ],
    properties: {
      createdAt: Swagger.date({description: "GreendocsProject's creation date"}),
      id: Swagger.uuid({description: "GreendocsProject's primary key"}),
      link: Swagger.url({description: "GreendocsProject's link"}),
      name: Swagger.string({description: "GreendocsProject's name"}),
      reserveViewLink: Swagger.url({description: "GreendocsProject's link to page related with reserve"}),
      submenuSelector: Swagger.string({description: "GreendocsProject's HTML selector of submenu in sidebar"}),
      suppliersExtractionAt: Swagger.date({description: 'Extraction date of GreendocsProject'}),
      suppliersViewLink: Swagger.url({description: "GreendocsProject's Link to page related with suppliers"}),
      updatedAt: Swagger.date({description: "GreendocsProject's update date"}),
      removedAt: Swagger.date({description: "GreendocsProject's removedAt date"}),
    },
  });
}
