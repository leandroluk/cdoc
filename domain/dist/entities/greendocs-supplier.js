"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TGreendocsSupplier = void 0;
var swagger_1 = require("../swagger");
var TGreendocsSupplier;
(function (TGreendocsSupplier) {
    TGreendocsSupplier.swagger = swagger_1.Swagger.object({
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
            address: swagger_1.Swagger.string({ description: "Extracted 'address' of GreendocsSupplier" }),
            city: swagger_1.Swagger.string({ description: "Extracted 'city' of GreendocsSupplier" }),
            createdAt: swagger_1.Swagger.date({ description: "GreendocsSupplier's creation date" }),
            email: swagger_1.Swagger.email({ description: "Extracted 'email' of GreendocsSupplier" }),
            greendocsProjectId: swagger_1.Swagger.uuid({ description: 'GreendocsProject foreign key related with of GreendocsSupplier' }),
            id: swagger_1.Swagger.integer({ description: "GreendocsSupplier's primary key" }),
            inAttentionBy: swagger_1.Swagger.date({ description: "Extracted in 'attention by' of GreendocsSupplier" }),
            instanceId: swagger_1.Swagger.integer({ description: "Extracted 'instance id' of GreendocsSupplier" }),
            link: swagger_1.Swagger.url({ description: 'Reference link in greendocs' }),
            name: swagger_1.Swagger.string({ description: "Extracted 'name' of GreendocsSupplier" }),
            phone: swagger_1.Swagger.string({ description: "Extracted 'phone' of GreendocsSupplier" }),
            responsible: swagger_1.Swagger.string({ description: "Extracted 'responsible' of GreendocsSupplier" }),
            situation: swagger_1.Swagger.string({ description: "Extracted 'situation' of GreendocsSupplier" }),
            state: swagger_1.Swagger.string({ description: "Extracted 'state' of GreendocsSupplier" }),
            supplierName: swagger_1.Swagger.string({ description: "Extracted 'supplier name' of GreendocsSupplier" }),
            updatedAt: swagger_1.Swagger.date({ description: "GreendocsSupplier's update date" }),
            zipCode: swagger_1.Swagger.string({ description: "Extracted 'zip code' of GreendocsSupplier" }),
            removedAt: swagger_1.Swagger.date({ description: "GreendocsSupplier's removedAt date" }),
        },
    });
})(TGreendocsSupplier || (exports.TGreendocsSupplier = TGreendocsSupplier = {}));
//# sourceMappingURL=greendocs-supplier.js.map