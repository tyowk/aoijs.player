import {
    type GuildNodeCreateOptions,
    Player,
    type PlayerInitOptions,
    type ExtractorExecutionContext
} from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
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

export class Manager {
    #player: Player;
    #client: Client;
    #cmd: Commands;
    #options: ManagerOptions;

    public constructor(client: Client, options: ManagerOptions = {}) {
        this.#player = new Player(client, options);
        this.#client = client;
        this.#client.manager = this;
        this.#cmd = new Commands(this, options.events);
        this.#options = options;

        this.loadMulti(DefaultExtractors);
    }

    public command(data): Manager {
        this.cmd.add(data);
        return this;
    }

    public register(extractor: any, options: any): Manager {
        this.extractors.register(extractor, options);
        return this;
    }

    public loadMulti(extractors: any[]): Manager {
        this.extractors.loadMulti(extractors);
        return this;
    }

    public get cmd(): Commands {
        return this.#cmd;
    }

    public get options(): ManagerOptions {
        return this.#options;
    }

    public get connectOptions(): ManagerOptions['connectOptions'] {
        return this.options.connectOptions;
    }

    public get events(): GuildQueueEvents[] | string[] | undefined {
        return this.options.events;
    }

    public get extractors(): ExtractorExecutionContext {
        return this.player.extractors;
    }

    public get player(): Player {
        return this.#player;
    }

    public get client(): Client {
        return this.#client;
    }
}
