"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSwagger = void 0;
exports.TSwagger = {
    object: function (data //
    ) { return (__assign({ type: 'object' }, data)); },
    array: function (data) { return (__assign({ type: 'array' }, data)); },
    boolean: function (data //
    ) { return (__assign({ type: 'boolean' }, data)); },
    number: function (data //
    ) { return (__assign({ type: 'number' }, data)); },
    integer: function (data //
    ) { return (__assign({ type: 'integer' }, data)); },
    string: function (data //
    ) { return (__assign({ type: 'string' }, data)); },
    url: function (data //
    ) { return (__assign({ type: 'string', format: 'url' }, data)); },
    enum: function (data //
    ) { return (__assign({ type: 'string' }, data)); },
    uuid: function (data //
    ) { return (__assign({ type: 'string', format: 'uuid' }, data)); },
    email: function (data //
    ) { return (__assign({ type: 'string', format: 'email' }, data)); },
    binary: function (data //
    ) { return (__assign({ type: 'string', format: 'binary' }, data)); },
    date: function (data //
    ) { return (__assign({ type: 'string', format: 'date-time' }, data)); },
};
//# sourceMappingURL=swagger.js.map