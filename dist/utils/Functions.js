"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Functions = void 0;
const typings_1 = require("../typings");
class Functions {
    #name;
    #description;
    #brackets;
    #returns;
    #fields;
    #aoiError = void 0;
    #d = void 0;
    constructor(data) {
        this.#name = data.name;
        this.#description = data.description;
        this.#brackets = data.brackets;
        this.#returns = data.returns;
        this.#fields = data.fields;
    }
    async code(d) {
        this.#aoiError = d.aoiError;
        this.#d = d;
        const data = d.util.aoiFunc(d);
        const args = data.inside.splits ?? [];
        if (data.err && this.brackets) {
            return d.error(data.err);
        }
        const maxLength = Math.max(args.length, this.fields.length);
        for (let i = 0; i < maxLength; i++) {
            let arg = args[i] ?? '';
            const field = this.fields[i] ?? {
                name: 'unknown',
                description: 'Unknown',
                type: typings_1.ParamType.Any,
                required: false
            };
            if (field.required && (!arg || arg === '')) {
                return this.error(`Missing argument \`${field.name}\` in function \`${this.name}\`!`, data);
            }
            if (field.rest) {
                const [...rest] = args.splice(i, this.fields.length - i);
                if (rest.length) {
                    arg = rest.join(';');
                }
            }
            args[i] = this.#switchArg(arg, field.type);
        }
        return await this.execute(d, args, data);
    }
    async execute(..._args) {
        return Promise.all([]);
    }
    async error(message, data) {
        if (!this.#aoiError)
            return;
        try {
            return this.#aoiError.fnError(this.#d, 'custom', data ?? {}, message);
        }
        catch {
            console.log(message);
            return this.#aoiError
                .fnError(this.#d, 'custom', data ?? {}, 'Something went wrong! Please check the console log!')
                .catch(Boolean);
        }
    }
    get name() {
        return this.#name;
    }
    get description() {
        return this.#description;
    }
    get brackets() {
        return this.#brackets;
    }
    get returns() {
        return this.#returns;
    }
    get fields() {
        return this.#fields;
    }
    get withParams() {
        return `${this.name}${this.brackets || this.fields.length > 0
            ? `[${this.fields
                ?.map((x) => {
                if (x.rest)
                    return `...${x.name}`;
                return `${x.name}${x.required ? '' : '?'}`;
            })
                .join(';')}]`
            : ''}`;
    }
    #switchArg(arg, type) {
        if (!arg || arg === '' || type === typings_1.ParamType.Void) {
            return void 0;
        }
        if (type === typings_1.ParamType.String) {
            return arg.toString().addBrackets();
        }
        if (type === typings_1.ParamType.Number) {
            const number = Number(arg);
            if (Number.isNaN(number))
                return Number.NaN;
            return number;
        }
        if (type === typings_1.ParamType.Boolean) {
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
        if (type === typings_1.ParamType.Object || type === typings_1.ParamType.Array) {
            try {
                return JSON.parse(arg);
            }
            catch {
                return void 0;
            }
        }
        if (type === typings_1.ParamType.Any) {
            return arg;
        }
        return void 0;
    }
}
exports.Functions = Functions;
