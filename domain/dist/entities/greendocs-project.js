"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TGreendocsProject = void 0;
var swagger_1 = require("../swagger");
var TGreendocsProject;
(function (TGreendocsProject) {
    TGreendocsProject.swagger = swagger_1.Swagger.object({
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
            createdAt: swagger_1.Swagger.date({ description: "GreendocsProject's creation date" }),
            id: swagger_1.Swagger.uuid({ description: "GreendocsProject's primary key" }),
            link: swagger_1.Swagger.url({ description: "GreendocsProject's link" }),
            name: swagger_1.Swagger.string({ description: "GreendocsProject's name" }),
            reserveViewLink: swagger_1.Swagger.url({ description: "GreendocsProject's link to page related with reserve" }),
            submenuSelector: swagger_1.Swagger.string({ description: "GreendocsProject's HTML selector of submenu in sidebar" }),
            suppliersExtractionAt: swagger_1.Swagger.date({ description: 'Extraction date of GreendocsProject' }),
            suppliersViewLink: swagger_1.Swagger.url({ description: "GreendocsProject's Link to page related with suppliers" }),
            updatedAt: swagger_1.Swagger.date({ description: "GreendocsProject's update date" }),
            removedAt: swagger_1.Swagger.date({ description: "GreendocsProject's removedAt date" }),
        },
    });
})(TGreendocsProject || (exports.TGreendocsProject = TGreendocsProject = {}));
//# sourceMappingURL=greendocs-project.js.map