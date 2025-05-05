import { type OpenAPIV3 } from 'openapi-types';
export declare const TSwagger: {
    object: <T extends object>(data?: ISwagger.RequiredObject<T>) => {
        type: "object";
    } & ISwagger.RequiredObject<T>;
    array: <T extends object>(data?: Omit<OpenAPIV3.ArraySchemaObject, "type" | "items"> & {
        items: ISwagger.RequiredObject<T> | OpenAPIV3.NonArraySchemaObject;
    }) => OpenAPIV3.ArraySchemaObject;
    boolean: (data?: OpenAPIV3.NonArraySchemaObject) => OpenAPIV3.NonArraySchemaObject;
    number: (data?: OpenAPIV3.NonArraySchemaObject) => OpenAPIV3.NonArraySchemaObject;
    integer: (data?: OpenAPIV3.NonArraySchemaObject) => OpenAPIV3.NonArraySchemaObject;
    string: (data?: OpenAPIV3.NonArraySchemaObject) => OpenAPIV3.NonArraySchemaObject;
    url: (data?: OpenAPIV3.NonArraySchemaObject) => OpenAPIV3.NonArraySchemaObject;
    enum: <T>(data?: Omit<OpenAPIV3.NonArraySchemaObject, "enum"> & {
        enum: Array<T>;
    }) => OpenAPIV3.NonArraySchemaObject;
    uuid: (data?: OpenAPIV3.NonArraySchemaObject) => OpenAPIV3.NonArraySchemaObject;
    email: (data?: OpenAPIV3.NonArraySchemaObject) => OpenAPIV3.NonArraySchemaObject;
    binary: (data?: OpenAPIV3.NonArraySchemaObject) => OpenAPIV3.NonArraySchemaObject;
    date: (data?: Omit<OpenAPIV3.NonArraySchemaObject, "type">) => OpenAPIV3.NonArraySchemaObject;
};
export declare namespace ISwagger {
    type RequiredObject<T extends object> = OpenAPIV3.BaseSchemaObject & {
        required: Array<keyof {
            [K in keyof T as string extends K ? never : object extends Pick<T, K> ? never : K]: 0;
        }>;
        properties: Record<keyof T, OpenAPIV3.SchemaObject>;
    };
}
