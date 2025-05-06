import { type TCreatable, type TRemovable, type TUpdatable } from '../generics';
import { type TGreendocsProject } from './greendocs-project';
export type TGreendocsSupplier = TGreendocsSupplier.System & TGreendocsSupplier.Fields & TGreendocsSupplier.Relations;
export declare namespace TGreendocsSupplier {
    type System = TUpdatable & TCreatable & TRemovable;
    type Fields = {
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
    type Relations = {
        /** @type {Project(id)} */
        greendocsProjectId: TGreendocsProject['id'];
    };
    const swagger: {
        type: "object";
    } & import("openapi-types").OpenAPIV3.BaseSchemaObject & {
        required: ("updatedAt" | "removedAt" | "createdAt" | keyof Fields | "greendocsProjectId")[];
        properties: {
            updatedAt: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            createdAt: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            removedAt: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            id: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            instanceId: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            link: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            name: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            supplierName: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            address: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            city: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            state: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            zipCode: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            email: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            phone: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            responsible: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            inAttentionBy: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            situation: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
            greendocsProjectId: import("openapi-types").OpenAPIV3.NonArraySchemaObject;
        };
    };
}
