export type THealthcheck = {
    run(): Promise<THealthcheck.Result>;
};
export declare namespace THealthcheck {
    type Result = {
        uptime: string;
    };
    namespace Result {
        const swagger: {
            type: "object";
        } & import("openapi-types").OpenAPIV3.BaseSchemaObject & {
            required: "uptime"[];
            properties: Record<"uptime", import("openapi-types").OpenAPIV3.SchemaObject>;
        };
    }
}
