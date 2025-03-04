import { Collective } from '../utils/Collective';
const interpreter = require('aoi.js/src/core/interpreter');
import type { Manager } from './Manager';
import type { Client, Channel, Guild, GuildMember, User } from 'discord.js';
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

                await interpreter(this.client, { guild, channel, member, author }, [], cmd, undefined, false, channel, {
                    queue,
                    ...args
                });
            }
        });
    }

    public add(data: CommandData): Commands {
        if (!data || typeof data !== 'object') return this;
        const command = this[data.type];
        if (!command || !Object.hasOwn(data, 'code')) return this;
        command.set(command.size, data);
        return this;
    }
}
