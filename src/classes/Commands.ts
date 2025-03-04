import { Collective } from '../utils/Collective';
const interpreter = require('aoi.js/src/core/interpreter');
import type { Manager } from './Manager';
import type { Client, Channel, Guild, GuildMember, User } from 'discord.js';
import type { GuildQueue } from 'discord-player';
import { Functions } from '../utils/Functions';
import { Events } from './Events';
import * as path from 'node:path';
import * as fs from 'node:fs';

export interface CommandData {
    name?: string;
    type: string;
    code: string;
    [key: string | number | symbol]: any;
}

export enum GuildQueueEvents {
    TrackStart = 'trackStart',
    TrackEnd = 'trackEnd',
    QueueEnd = 'queueEnd'
}

declare global {
    interface String {
        deleteBrackets(): string;
        addBrackets(): string;
        removeBrackets(): string;
    }
}

export class Commands {
    public readonly manager: Manager;
    public readonly client: Client;
    public readonly events: string[] = [];

    public trackStart?: Collective<number, CommandData>;
    public trackEnd?: Collective<number, CommandData>;
    public queueEnd?: Collective<number, CommandData>;

    constructor(manager: Manager, events?: string[]) {
        this.manager = manager;
        this.client = manager.client;

        if (!Array.isArray(events)) return;
        const _events = events.filter((e: string): boolean => {
            return (Object.values(GuildQueueEvents) as string[]).includes(e as string);
        }) as string[];

        if (_events.length === 0) return;
        this.events = _events;
        new Events(this.manager);
        this.loadFunctions();

        for (const event of _events) {
            this[event] = new Collective<number, CommandData>();
            this.#bindEvents(event);
        }
    }

    #bindEvents(event): Commands {
        const commands = this[event];
        if (!commands) return this;

        this.manager.player.events.on(event, async (queue: GuildQueue<any>, ...args: any) => {
            for (const cmd of commands.values()) {
                if (!cmd) continue;

                let guild: Guild = queue.guild;
                const author: User | null = queue.currentTrack?.requestedBy ?? null;
                const member: GuildMember | null =
                    guild && author ? (guild.members.cache.get(author.id) ?? null) : null;
                let channel: Channel | null = queue.metadata.text;

                if (cmd.channel.includes('$') && cmd.channel !== '$') {
                    channel =
                        this.client.channels.cache.get(
                            (
                                await interpreter(
                                    this.client,
                                    { guild, channel, member, author },
                                    [],
                                    { code: cmd.channel, name: 'NameParser' },
                                    undefined,
                                    true,
                                    undefined,
                                    {}
                                )
                            )?.code
                        ) ?? null;
                }

                if (!channel) channel = queue.metadata.text;
                if (!guild) guild = queue.guild;

                await this.manager.player.context.provide({ guild }, async () => {
                    await interpreter(
                        this.client,
                        { guild, channel, member, author },
                        [],
                        cmd,
                        undefined,
                        false,
                        channel,
                        {
                            queue,
                            ...args
                        }
                    );
                });
            }
        });

        return this;
    }

    public loadFunctions(basePath = path.join(__dirname, '..', 'functions')): Commands {
        const files = fs.readdirSync(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = fs.lstatSync(filePath);
            if (stat.isDirectory()) {
                this.loadFunctions(filePath);
            } else if (file.endsWith('.js')) {
                const RawFunction = require(filePath).default;
                if (!RawFunction && !(RawFunction.prototype instanceof Functions)) continue;
                const func = new RawFunction();
                if (!func.name) continue;

                if (typeof func.code === 'function') {
                    this.client.functionManager.createFunction({
                        name: func.name,
                        type: 'djs',
                        code: func.code.bind(func)
                    });
                } else if (typeof func.code === 'string') {
                    this.client.functionManager.createFunction({
                        name: func.name,
                        type: 'aoi.js',
                        code: func.code
                    });
                }
            }
        }

        return this;
    }

    public add(data: CommandData): Commands {
        if (!data || typeof data !== 'object') return this;
        const command = this[data.type];
        if (!command || !Object.hasOwn(data, 'code')) return this;
        command.set(command.size, data);
        return this;
    }
}
