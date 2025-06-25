import { Collective } from '../utils/Collective';
const interpreter = require('aoi.js/src/core/interpreter');
import { Functions } from '../utils/Functions';
import { join } from 'node:path';
import { readdirSync, lstatSync } from 'node:fs';
import type { Manager } from './Manager';
import type { Client, Channel, Guild, GuildMember, User } from 'discord.js';
import { type GuildQueue, GuildQueueEvent } from 'discord-player';
import type { CommandData } from '../typings';

/**
 * The commands manager instance.
 *
 * @class Commands
 * @param {Manager} manager - The manager instance.
 * @param {string[] | GuildQueueEvent[]} [events] - The events to listen to.
 */
export class Commands {
    [key: string]: any;

    /**
     * The manager instance.
     */
    public readonly manager: Manager;

    /**
     * The discord client instance.
     */
    public readonly client: Client;

    /**
     * The events to listen to.
     */
    public readonly events: string[] = [];

    constructor(manager: Manager, events: string[] | GuildQueueEvent[] | undefined) {
        this.manager = manager;
        this.client = manager.client;
        this.loadFunctions();

        if (Array.isArray(events)) {
            this.events = events.filter((e: string): boolean => {
                return (Object.values(GuildQueueEvent) as string[]).includes(e as string);
            }) as string[];

            if (this.events.length) {
                for (const event of this.events) {
                    if (this[event] instanceof Collective) continue;
                    this[event] = new Collective<number, CommandData>();
                    this.#bindEvents(event as GuildQueueEvent);
                }
            }
        }
    }

    /**
     * Binds the events to the commands.
     *
     * @param {GuildQueueEvent} event - The event to bind.
     * @returns {Commands} The commands instance.
     */
    #bindEvents(event: GuildQueueEvent): Commands {
        const commands = this[event];
        if (!commands) return this;

        this.manager.player.events.on(event, async (queue: GuildQueue<any>, ...args: any) => {
            for (const cmd of commands.values()) {
                if (!cmd || !cmd.code) continue;

                let guild: Guild = queue.guild;
                const author: User | null = queue.currentTrack?.requestedBy ?? null;
                let channel: Channel | null = queue.metadata.text;
                const member: GuildMember | null =
                    guild && author ? (guild.members.cache.get(author.id) ?? null) : null;

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

    /**
     * Loads the functions from the functions directory.
     *
     * @param {string} [basePath] - The base path to load the functions from.
     * @returns {Commands} The commands instance.
     */
    public loadFunctions(basePath: string = join(__dirname, '..', 'functions')): Commands {
        const files = readdirSync(basePath);
        for (const file of files) {
            const filePath = join(basePath, file);
            const stat = lstatSync(filePath);
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
                        params: func.params,
                        type: 'aoi.js',
                        code: func.code
                    });
                }
            }
        }

        return this;
    }

    /**
     * Adds a new command to the commands instance.
     *
     * @param {CommandData} data - The command data.
     * @returns {Commands} The commands instance.
     */
    public add(data: CommandData): Commands {
        if (!data || typeof data !== 'object') return this;
        const command = this[data.type];
        if (!command || !Object.hasOwn(data, 'code')) return this;
        command.set(command.size, data);
        return this;
    }
}
