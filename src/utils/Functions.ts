export enum ArgType {
    String = 0,
    Void = 1,
    Number = 2,
    Boolean = 3,
    Object = 4,
    Array = 5
}

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
    }[];

    #aoiError: any;
    #d: any;

    constructor(data: any) {
        this.#name = data.name;
        this.#description = data.description;
        this.#brackets = data.brackets;
        this.#returns = data.returns;
        this.#fields = data.fields;

        this.#aoiError = void 0;
        this.#d = void 0;
    }

    public async code(d: any): Promise<unknown> {
        this.#aoiError = d.aoiError;
        this.#d = d;

        const data = d.util.aoiFunc(d);
        const args = data.inside.splits ?? [];
        if (data.err && this.brackets) {
            return d.error(data.err);
        }

        for (let i = 0; i < this.fields.length; i++) {
            let arg = args[i] ?? '';
            const field = this.fields[i] ?? {};
            if (field.required && (!arg || arg === '')) {
                return this.error(`Missing argument ${field.name} in function ${this.name}!`, data);
            }

            arg = this.#ArgType(arg, field.type);
            args[i] = arg;
        }

        const result = await this.execute(d, args, data);
        return result;
    }

    public async execute(..._args: any): Promise<object> {
        return Promise.all([]);
    }

    public async error(message: string, data?: object) {
        if (!this.#aoiError) return;
        return this.#aoiError.fnError(this.#d, 'custom', data ?? {}, message);
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
    }[] {
        return this.#fields;
    }

    #ArgType(arg: string, type: ArgType): any {
        if (!arg || arg === '') return void 0;
        if (type === ArgType.String) {
            return arg.toString();
        }
        if (type === ArgType.Void) {
            return void 0;
        }
        if (type === ArgType.Number) {
            const number = Number(arg);
            if (Number.isNaN(number)) return void 0;
            return number;
        }
        if (type === ArgType.Boolean) {
            const boolean: string | boolean = arg.toLowerCase();
            if (boolean === 'true') return true;
            if (boolean === 'false') return false;
            return void 0;
        }
        if (type === ArgType.Object) {
            try {
                return JSON.parse(arg);
            } catch {
                return void 0;
            }
        }
        if (type === ArgType.Array) {
            try {
                return JSON.parse(arg);
            } catch {
                return void 0;
            }
        }
    }
}
