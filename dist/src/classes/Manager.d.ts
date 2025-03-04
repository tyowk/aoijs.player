import { type GuildNodeCreateOptions, Player, type PlayerInitOptions, type ExtractorExecutionContext } from 'discord-player';
import type { Client } from 'discord.js';
import { Commands, type GuildQueueEvents } from './Commands';
import type { FunctionManager } from 'aoi.js';
export interface IManagerOptions extends PlayerInitOptions {
    connectOptions?: Omit<GuildNodeCreateOptions<unknown>, 'metadata'>;
    events?: string[] | GuildQueueEvents[];
    includeExtractors?: any[];
}
declare module 'discord.js' {
    interface Client {
        manager: Manager;
        functionManager: FunctionManager;
    }
}
export declare class Manager {
    #private;
    constructor(client: Client, options?: IManagerOptions);
    command(data: any): Manager;
    register(extractor: any, options: any): Manager;
    get cmd(): Commands;
    get options(): IManagerOptions;
    get connectOptions(): IManagerOptions['connectOptions'];
    get events(): GuildQueueEvents[] | string[] | undefined;
    get extractors(): ExtractorExecutionContext;
    get player(): Player;
    get client(): Client;
}
