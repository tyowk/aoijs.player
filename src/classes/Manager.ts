import {
    type BaseExtractor,
    type GuildNodeCreateOptions,
    Player,
    type PlayerInitOptions,
    type ExtractorExecutionContext
} from 'discord-player';
import type { Client } from 'discord.js';
import { Commands, type GuildQueueEvents } from './Commands';
import type { FunctionManager } from 'aoi.js';
import { Functions } from '../utils/Functions';
import { Events } from './Events';
import * as path from 'node:path';
import * as fs from 'node:fs';

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

export class Manager {
    #player: Player;
    #client: Client;
    #cmd: Commands;
    #options: IManagerOptions;

    public constructor(client: Client, options: IManagerOptions = {}) {
        this.#player = new Player(client, options);
        this.#client = client;
        this.#client.manager = this;
        this.#cmd = new Commands(this, options.events);
        this.#options = options;

        if (this.options.includeExtractors) {
            this.player.extractors.loadMulti(this.options.includeExtractors);
        }

        new Events(this);
        this.#loadFunctions();
    }

    #loadFunctions(basePath = path.join(__dirname, '..', 'functions')) {
        const files = fs.readdirSync(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = fs.lstatSync(filePath);
            if (stat.isDirectory()) {
                this.#loadFunctions(filePath);
            } else if (file.endsWith('.js')) {
                const RawFunction = require(filePath).default;
                if (!RawFunction && !(RawFunction.prototype instanceof Functions)) continue;
                const func = new RawFunction();
                if (!func.name) continue;
                this.#client.functionManager.createFunction({
                    name: func.name,
                    type: 'djs',
                    code: func.code.bind(func)
                });
            }
        }
    }

    public command(data): Manager {
        this.cmd.add(data);
        return this;
    }

    public register(extractor: any, options: any): Manager {
        this.player.extractors.register(extractor, options);
        return this;
    }

    public get cmd(): Commands {
        return this.#cmd;
    }

    public get options(): IManagerOptions {
        return this.#options;
    }

    public get connectOptions(): IManagerOptions['connectOptions'] {
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
