"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Functions_instances, _Functions_name, _Functions_description, _Functions_brackets, _Functions_returns, _Functions_fields, _Functions_aoiError, _Functions_d, _Functions_switchArg;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Functions = void 0;
const typings_1 = require("../typings");
class Functions {
    constructor(data) {
        _Functions_instances.add(this);
        _Functions_name.set(this, void 0);
        _Functions_description.set(this, void 0);
        _Functions_brackets.set(this, void 0);
        _Functions_returns.set(this, void 0);
        _Functions_fields.set(this, void 0);
        _Functions_aoiError.set(this, void 0);
        _Functions_d.set(this, void 0);
        __classPrivateFieldSet(this, _Functions_name, data.name, "f");
        __classPrivateFieldSet(this, _Functions_description, data.description, "f");
        __classPrivateFieldSet(this, _Functions_brackets, data.brackets, "f");
        __classPrivateFieldSet(this, _Functions_returns, data.returns, "f");
        __classPrivateFieldSet(this, _Functions_fields, data.fields, "f");
    }
    async code(d) {
        __classPrivateFieldSet(this, _Functions_aoiError, d.aoiError, "f");
        __classPrivateFieldSet(this, _Functions_d, d, "f");
        const data = d.util.aoiFunc(d);
        const args = data.inside.splits ?? [];
        if (data.err && this.brackets) {
            return d.error(data.err);
        }
        if (args.length > this.fields.length) {
            args.splice(this.fields.length);
        }
        for (let i = 0; i < this.fields.length; i++) {
            let arg = args[i] ?? '';
            const field = this.fields[i] ?? {};
            if (field.required && (!arg || arg === '')) {
                return this.error(`Missing argument \`${field.name}\` in function \`${this.name}\`!`, data);
            }
            if (field.rest) {
                const [...rest] = args.splice(i, this.fields.length - i);
                if (rest.length) {
                    arg = rest.join(';');
                }
            }
            args[i] = __classPrivateFieldGet(this, _Functions_instances, "m", _Functions_switchArg).call(this, arg, field.type);
        }
        return await this.execute(d, args, data);
    }
    async execute(..._args) {
        return Promise.all([]);
    }
    async error(message, data) {
        if (!__classPrivateFieldGet(this, _Functions_aoiError, "f"))
            return;
        try {
            return __classPrivateFieldGet(this, _Functions_aoiError, "f").fnError(__classPrivateFieldGet(this, _Functions_d, "f"), 'custom', data ?? {}, message);
        }
        catch {
            console.log(message);
            return __classPrivateFieldGet(this, _Functions_aoiError, "f")
                .fnError(__classPrivateFieldGet(this, _Functions_d, "f"), 'custom', data ?? {}, 'Something went wrong! Please check the console log!')
                .catch(Boolean);
        }
    }
    get name() {
        return __classPrivateFieldGet(this, _Functions_name, "f");
    }
    get description() {
        return __classPrivateFieldGet(this, _Functions_description, "f");
    }
    get brackets() {
        return __classPrivateFieldGet(this, _Functions_brackets, "f");
    }
    get returns() {
        return __classPrivateFieldGet(this, _Functions_returns, "f");
    }
    get fields() {
        return __classPrivateFieldGet(this, _Functions_fields, "f");
    }
}
exports.Functions = Functions;
_Functions_name = new WeakMap(), _Functions_description = new WeakMap(), _Functions_brackets = new WeakMap(), _Functions_returns = new WeakMap(), _Functions_fields = new WeakMap(), _Functions_aoiError = new WeakMap(), _Functions_d = new WeakMap(), _Functions_instances = new WeakSet(), _Functions_switchArg = function _Functions_switchArg(arg, type) {
    if (!arg || arg === '' || type === typings_1.ArgType.Void) {
        return void 0;
    }
    if (type === typings_1.ArgType.String) {
        return arg.toString().addBrackets();
    }
    if (type === typings_1.ArgType.Number) {
        const number = Number(arg);
        if (Number.isNaN(number))
            return Number.NaN;
        return number;
    }
    if (type === typings_1.ArgType.Boolean) {
        const boolean = arg.toLowerCase();
        if (boolean === 'true')
            return true;
        if (boolean === 'false')
            return false;
        if (boolean === 'yes')
            return true;
        if (boolean === 'no')
            return false;
        return void 0;
    }
    if (type === typings_1.ArgType.Object || type === typings_1.ArgType.Array) {
        try {
            return JSON.parse(arg);
        }
        catch {
            return void 0;
        }
    }
    return void 0;
};
