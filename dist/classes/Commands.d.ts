import type { Manager } from './Manager';
import type { Client } from 'discord.js';
import { GuildQueueEvent } from 'discord-player';
import type { CommandData } from '../typings';
export declare class Commands {
    #private;
    [key: string]: any;
    readonly manager: Manager;
    readonly client: Client;
    readonly events: string[];
    constructor(manager: Manager, events: string[] | GuildQueueEvent[] | undefined);
    loadFunctions(basePath?: string): Commands;
    add(data: CommandData): Commands;
}
