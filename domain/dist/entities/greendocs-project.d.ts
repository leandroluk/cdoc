import { type TCreatable, type TRemovable, type TUpdatable } from '../generics';
export type TGreendocsProject = TGreendocsProject.System & TGreendocsProject.Fields;
export declare namespace TGreendocsProject {
    type System = TUpdatable & TCreatable & TRemovable;
    type Fields = {
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
    const swagger: {
        type: "object";
    } & import("openapi-types").OpenAPIV3.BaseSchemaObject & {
        required: ("updatedAt" | "removedAt" | "createdAt" | keyof Fields)[];
        properties: {
            updatedAt: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            createdAt: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            removedAt: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            id: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            link: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            name: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            submenuSelector: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            suppliersExtractionAt: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            suppliersViewLink: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            reserveViewLink: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
        };
    };
}
