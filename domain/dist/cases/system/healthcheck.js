"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THealthcheck = void 0;
var generics_1 = require("../../generics");
var THealthcheck;
(function (THealthcheck) {
    var Result;
    (function (Result) {
        Result.swagger = generics_1.TSwagger.object({
            required: ['uptime'],
            properties: {
                uptime: generics_1.TSwagger.string({
                    description: 'Uptime of application',
                    example: '10d',
                }),
            },
        });
    })(Result = THealthcheck.Result || (THealthcheck.Result = {}));
})(THealthcheck || (exports.THealthcheck = THealthcheck = {}));
//# sourceMappingURL=healthcheck.js.map