import { Player, type ExtractorExecutionContext } from 'discord-player';
import type { Client } from 'discord.js';
import { Commands } from './Commands';
import type { PlayerEvents, ManagerOptions } from '../typings';
export declare class Manager {
    #private;
    constructor(client: Client, options?: ManagerOptions);
    command(data: any): Manager;
    register(extractor: any, options: any): Manager;
    loadMulti(extractors: any[]): Manager;
    get cmd(): Commands;
    get options(): ManagerOptions;
    get connectOptions(): ManagerOptions['connectOptions'];
    get events(): PlayerEvents[] | string[];
    get extractors(): ExtractorExecutionContext;
    get player(): Player;
    get client(): Client;
}
