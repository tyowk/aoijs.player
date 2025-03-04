import { Collective } from '../utils/Collective';
import { interpreter } from 'aoi.js/src/core/interpreter';
import type { Manager } from './Manager';
import type { Client, Channel, Guild } from 'discord.js';
import type { GuildQueue } from 'discord-player';

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
    public readonly events: GuildQueueEvents[] = [];

    public trackStart?: Collective<number, CommandData>;
    public trackEnd?: Collective<number, CommandData>;
    public queueEnd?: Collective<number, CommandData>;

    constructor(manager: Manager, events?: Array<string>) {
        this.manager = manager;
        this.client = manager.client;

        if (!Array.isArray(events)) return;
        const _events = events.filter((e: string): boolean => {
            return Object.values(GuildQueueEvents).includes(e as GuildQueueEvents);
        }) as GuildQueueEvents[];

        if (_events.length === 0) return;
        this.events = _events;

        for (const event of _events) {
            this[event] = new Collective<number, CommandData>();
            this.#bindEvents(event);
        }
    }

    #bindEvents(event) {
        const commands = this[event];
        if (!commands) return;

        this.manager.player.events.on(event, async (queue: GuildQueue<any>, ...args: any) => {
            for (const cmd of commands.values()) {
                if (!cmd) continue;
                let guild: Guild = queue.guild;
                let channel: Channel | null = queue.channel;

                if (cmd.channel.includes('$') && cmd.channel !== '$') {
                    channel =
                        this.client.channels.cache.get(
                            (
                                await interpreter(
                                    this.client,
                                    { guild, channel },
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

                if (!channel) channel = queue.channel;
                if (!guild) guild = queue.guild;

                await interpreter(this.client, { guild, channel }, [], cmd, undefined, false, channel, {
                    queue,
                    ...args
                });
            }
        });
    }

    public add(data: CommandData): Commands {
        if (!data || typeof data !== 'object') return this;
        const command = this[data.type];
        if (!command || !data.hasOwn('code')) return this;
        command.set(command.size, data);
        return this;
    }
}
