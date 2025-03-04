import { type GuildNodeCreateOptions, Player, type PlayerInitOptions, type ExtractorExecutionContext } from 'discord-player';
import type { Client } from 'discord.js';
import { Commands, type GuildQueueEvents } from './Commands';
import type { FunctionManager } from 'aoi.js';
export interface ManagerOptions extends PlayerInitOptions {
    connectOptions?: Omit<GuildNodeCreateOptions<unknown>, 'metadata'>;
    events?: string[] | GuildQueueEvents[];
}
declare module 'discord.js' {
    interface Client {
        manager: Manager;
        functionManager: FunctionManager;
    }
}
export declare class Manager {
    #private;
    constructor(client: Client, options?: ManagerOptions);
    command(data: any): Manager;
    register(extractor: any, options: any): Manager;
    loadMulti(extractors: any[]): Manager;
    get cmd(): Commands;
    get options(): ManagerOptions;
    get connectOptions(): ManagerOptions['connectOptions'];
    get events(): GuildQueueEvents[] | string[] | undefined;
    get extractors(): ExtractorExecutionContext;
    get player(): Player;
    get client(): Client;
}
