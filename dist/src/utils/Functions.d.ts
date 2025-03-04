export declare enum ArgType {
    String = 0,
    Void = 1,
    Number = 2,
    Boolean = 3,
    Object = 4,
    Array = 5
}
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
        type: ArgType;
        required: boolean;
        rest: boolean;
    }[];
}
