import { Player, type GuildQueueEvent, type ExtractorExecutionContext } from 'discord-player';
import { Commands } from './Commands';
import type { ManagerOptions, CommandData } from '../typings';
import type { Client } from 'discord.js';
export declare class Manager {
    #private;
    constructor(client: Client, options?: ManagerOptions);
    static create(client: Client, options?: ManagerOptions): Manager;
    command(data: CommandData): Manager;
    register(extractor: any, options: any): Manager;
    loadMulti(extractors: any[]): Manager;
    get cmd(): Commands;
    get options(): ManagerOptions;
    get connectOptions(): Omit<ManagerOptions, 'youtube' | 'soundcloud' | 'spotify' | 'events'>;
    get events(): GuildQueueEvent[] | string[];
    get extractors(): ExtractorExecutionContext;
    get player(): Player;
    get client(): Client;
}
