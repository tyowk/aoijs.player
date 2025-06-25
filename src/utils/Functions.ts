import { ParamType } from '../typings';

/**
 * The functions class.
 *
 * @class Functions
 * @param {any} data - The data for the function.
 * @param {string} data.name - The name of the function.
 * @param {string} data.description - The description of the function.
 * @param {boolean} data.brackets - Whether the function uses brackets.
 * @param {any} data.returns - The return type of the function.
 * @param {{
 *     name: string;
 *     description: string;
 *     type: ParamType;
 *     required: boolean;
 *     rest: boolean;
 * }} data.fields - The fields of the function.
 */
export class Functions {
    readonly #name: string;
    readonly #description: string;
    readonly #brackets: boolean;
    readonly #returns: any;
    readonly #fields: {
        name: string;
        description: string;
        type: ParamType;
        required: boolean;
        rest?: boolean;
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

    /**
     * The code for the function.
     *
     * @param {any} d - The data for the function.
     * @returns {Promise<unknown>} The return value of the function.
     */
    public async code(d: any): Promise<unknown> {
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
                type: ParamType.Any,
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

    /**
     * The main execution function.
     *
     * @param {any[]} _args - The arguments for the function.
     * @returns {Promise<object>} The return value of the function.
     */
    public async execute(..._args: any): Promise<object> {
        return Promise.all([]);
    }

    /**
     * The error function.
     *
     * @param {string} message - The error message.
     * @param {object} [data] - The data for the error.
     * @returns {Promise<any>} The return value of the function.
     */
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

    /**
     * Gets the name of the function.
     *
     * @returns {string} The name of the function.
     */
    public get name(): string {
        return this.#name;
    }

    /**
     * Gets the description of the function.
     *
     * @returns {string} The description of the function.
     */
    public get description(): string {
        return this.#description;
    }

    /**
     * Gets whether the function uses brackets.
     *
     * @returns {boolean} Whether the function uses brackets.
     */
    public get brackets(): boolean {
        return this.#brackets;
    }

    /**
     * Gets the return type of the function.
     *
     * @returns {any} The return type of the function.
     */
    public get returns(): any {
        return this.#returns;
    }

    /**
     * Gets the fields of the function.
     *
     * @returns {{
     *     name: string;
     *     description: string;
     *     type: ParamType;
     *     required: boolean;
     *     rest?: boolean;
     * }}
     */
    public get fields(): {
        name: string;
        description: string;
        type: ParamType;
        required: boolean;
        rest?: boolean;
    }[] {
        return this.#fields;
    }

    /**
     * The name of the function with parameters
     *
     * @return {string} - The name of the function with parameters
     */
    public get withParams(): string {
        return `${this.name}${
            this.brackets || this.fields.length > 0
                ? `[${this.fields
                      ?.map((x) => {
                          if (x.rest) return `...${x.name}`;
                          return `${x.name}${x.required ? '' : '?'}`;
                      })
                      .join(';')}]`
                : ''
        }`;
    }

    /**
     * Switches the argument type.
     *
     * @param {string} arg - The argument to switch.
     * @param {ParamType} type - The type of the argument.
     * @returns {any} The switched argument.
     */
    #switchArg(arg: string, type: ParamType): any {
        if (!arg || arg === '' || type === ParamType.Void) {
            return void 0;
        }

        if (type === ParamType.String) {
            return arg.toString().addBrackets();
        }

        if (type === ParamType.Number) {
            const number = Number(arg);
            if (Number.isNaN(number)) return Number.NaN;
            return number;
        }

        if (type === ParamType.Boolean) {
            const boolean: string = arg.toLowerCase();
            if (boolean === 'true') return true;
            if (boolean === 'false') return false;
            if (boolean === 'yes') return true;
            if (boolean === 'no') return false;
            return void 0;
        }

        if (type === ParamType.Object || type === ParamType.Array) {
            try {
                return JSON.parse(arg);
            } catch {
                return void 0;
            }
        }

        if (type === ParamType.Any) {
            return arg;
        }

        return void 0;
    }
}
