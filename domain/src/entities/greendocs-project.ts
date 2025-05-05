import {type TCreatable, type TRemovable, type TUpdatable} from '#/generics';

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
}
