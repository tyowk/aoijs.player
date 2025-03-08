import { Collective } from '../utils/Collective';
import type { Manager } from './Manager';
import type { Client } from 'discord.js';
import type { CommandData } from '../typings';
export declare class Commands {
    #private;
    readonly manager: Manager;
    readonly client: Client;
    readonly events: string[];
    trackStart?: Collective<number, CommandData>;
    trackEnd?: Collective<number, CommandData>;
    queueEnd?: Collective<number, CommandData>;
    constructor(manager: Manager, events?: string[]);
    loadFunctions(basePath?: string): Commands;
    add(data: CommandData): Commands;
}
