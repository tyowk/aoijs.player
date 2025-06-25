import { ParamType } from '../typings';
export declare class Functions {
    #private;
    constructor(data: any);
    code(d: any): Promise<unknown>;
    execute(..._args: any): Promise<object>;
    error(message: string, data?: object): Promise<any>;
    get name(): string;
    get description(): string;
    get brackets(): boolean;
    get returns(): any;
    get fields(): {
        name: string;
        description: string;
        type: ParamType;
        required: boolean;
        rest?: boolean;
    }[];
    get withParams(): string;
}
