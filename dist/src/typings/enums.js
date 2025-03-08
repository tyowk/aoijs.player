"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgType = void 0;
var ArgType;
(function (ArgType) {
    ArgType[ArgType["String"] = 0] = "String";
    ArgType[ArgType["Void"] = 1] = "Void";
    ArgType[ArgType["Number"] = 2] = "Number";
    ArgType[ArgType["Boolean"] = 3] = "Boolean";
    ArgType[ArgType["Object"] = 4] = "Object";
    ArgType[ArgType["Array"] = 5] = "Array";
})(ArgType || (exports.ArgType = ArgType = {}));
