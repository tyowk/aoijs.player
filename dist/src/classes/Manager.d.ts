import { type BaseExtractor, type GuildNodeCreateOptions, Player, type PlayerInitOptions, type ExtractorExecutionContext } from 'discord-player';
import type { Client } from 'discord.js';
import { Commands, type GuildQueueEvents } from './Commands';
import type { FunctionManager } from 'aoi.js';
export interface IManagerOptions extends PlayerInitOptions {
    connectOptions?: Omit<GuildNodeCreateOptions<unknown>, 'metadata'>;
    events?: GuildQueueEvents[];
    includeExtractors?: (typeof BaseExtractor)[];
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
    get cmd(): Commands;
    get options(): IManagerOptions;
    get connectOptions(): IManagerOptions['connectOptions'];
    get events(): GuildQueueEvents[] | undefined;
    get extractors(): ExtractorExecutionContext;
    get player(): Player;
    get client(): Client;
}
