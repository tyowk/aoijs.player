import { ArgType } from '../typings';

export class Functions {
    readonly #name: string;
    readonly #description: string;
    readonly #brackets: boolean;
    readonly #returns: any;
    readonly #fields: {
        name: string;
        description: string;
        type: ArgType;
        required: boolean;
        rest: boolean;
    }[];

    #aoiError: any = void 0;
    #d: any = void 0;

    constructor(data: any) {
        this.#name = data.name;
        this.#description = data.description;
        this.#brackets = data.brackets;
        this.#returns = data.returns;
        this.#fields = data.fields;
    }

    public async code(d: any): Promise<unknown> {
        this.#aoiError = d.aoiError;
        this.#d = d;

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

            args[i] = this.#switchArg(arg, field.type);
        }

        return await this.execute(d, args, data);
    }

    public async execute(..._args: any): Promise<object> {
        return Promise.all([]);
    }

    public async error(message: string, data?: object): Promise<any> {
        if (!this.#aoiError) return;
        try {
            return this.#aoiError.fnError(this.#d, 'custom', data ?? {}, message);
        } catch {
            console.log(message);
            return this.#aoiError
                .fnError(this.#d, 'custom', data ?? {}, 'Something went wrong! Please check the console log!')
                .catch(Boolean);
        }
    }

    public get name(): string {
        return this.#name;
    }

    public get description(): string {
        return this.#description;
    }

    public get brackets(): boolean {
        return this.#brackets;
    }

    public get returns(): any {
        return this.#returns;
    }

    public get fields(): {
        name: string;
        description: string;
        type: ArgType;
        required: boolean;
        rest: boolean;
    }[] {
        return this.#fields;
    }

    #switchArg(arg: string, type: ArgType): any {
        if (!arg || arg === '' || type === ArgType.Void) {
            return void 0;
        }

        if (type === ArgType.String) {
            return arg.toString().addBrackets();
        }

        if (type === ArgType.Number) {
            const number = Number(arg);
            if (Number.isNaN(number)) return Number.NaN;
            return number;
        }

        if (type === ArgType.Boolean) {
            const boolean: string = arg.toLowerCase();
            if (boolean === 'true') return true;
            if (boolean === 'false') return false;
            if (boolean === 'yes') return true;
            if (boolean === 'no') return false;
            return void 0;
        }

        if (type === ArgType.Object || type === ArgType.Array) {
            try {
                return JSON.parse(arg);
            } catch {
                return void 0;
            }
        }

        return void 0;
    }
}
