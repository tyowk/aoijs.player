import { Player, type GuildQueueEvent, type ExtractorExecutionContext } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { Commands } from './Commands';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { SoundcloudExtractor } from 'discord-player-soundcloud';
import { SpotifyExtractor } from 'discord-player-spotify';
import { Log } from 'youtubei.js';
import type { ManagerOptions, CommandData } from '../typings';
import type { Client } from 'discord.js';
Log.setLevel(Log.Level.NONE);

/**
 * The main instance for the player manager.
 *
 * @class Manager
 * @param {Client} client - The discord client instance.
 * @param {ManagerOptions} [options] - The options for the manager.
 * @example ```typescript
 * const manager = new Manager(<Client>, {
 *     events: [Events.PlayerStart],
 *     youtube: {
 *         generateWithPoToken: true,
 *         streamOptions: { useClient: 'WEB_EMBEDDED' }
 *     }
 * });
 */
export class Manager {
    /**
     * The player instance.
     */
    #player: Player;

    /**
     * The discord client instance.
     */
    #client: Client;

    /**
     * The commands instance.
     */
    #cmd: Commands;

    /**
     * The options for the manager.
     */
    #options: ManagerOptions;

    public constructor(client: Client, options: ManagerOptions = {}) {
        this.#player = new Player(client, options);
        this.#client = client;
        this.#client.manager = this;
        this.#cmd = new Commands(this, options.events);
        this.#options = options;
        this.register(
            YoutubeiExtractor,
            options.youtube ?? {
                generateWithPoToken: true,
                ...(options.youtube ?? {}),
                streamOptions: {
                    useClient: 'WEB_EMBEDDED',
                    ...(options.youtube ?? ({} as any)).streamOptions
                }
            }
        );
        this.register(SpotifyExtractor, options.spotify ?? {});
        this.register(SoundcloudExtractor, options.soundcloud ?? {});
        this.loadMulti(DefaultExtractors);
    }

    /**
     * Creates a new manager instance.
     *
     * @param {Client} client - The discord client instance.
     * @param {ManagerOptions} [options] - The options for the manager.
     * @returns {Manager} The manager instance.
     * @example ```typescript
     * const manager = Manager.create(<Client>);
     * client.manager = manager;
     * ````
     */
    public static create(client: Client, options: ManagerOptions = {}): Manager {
        return new Manager(client, options);
    }

    /**
     * Adds a new command to the manager.
     *
     * @param {CommandData} data - The command data.
     * @returns {Manager} The manager instance.
     */
    public command(data: CommandData): Manager {
        this.cmd.add(data);
        return this;
    }

    /**
     * Registers a new extractor.
     *
     * @param {any} extractor - The extractor to register.
     * @param {any} options - The options for the extractor.
     * @returns {Manager} The manager instance.
     */
    public register(extractor: any, options: any): Manager {
        this.extractors.register(extractor, options);
        return this;
    }

    /**
     * Loads multiple extractors.
     *
     * @param {any[]} extractors - The extractors to load.
     * @returns {Manager} The manager instance.
     */
    public loadMulti(extractors: any[]): Manager {
        this.extractors.loadMulti(extractors);
        return this;
    }

    /**
     * Gets the commands instance.
     *
     * @returns {Commands} The commands instance.
     */
    public get cmd(): Commands {
        return this.#cmd;
    }

    /**
     * Gets the options for the manager.
     *
     * @returns {ManagerOptions} The options for the manager.
     */
    public get options(): ManagerOptions {
        return this.#options;
    }

    /**
     * Gets the connect options for the manager.
     *
     * @returns {ManagerOptions['connectOptions']} The connect options for the manager.
     */
    public get connectOptions(): Omit<ManagerOptions, 'youtube' | 'soundcloud' | 'spotify' | 'events'> {
        const { youtube, soundcloud, spotify, events, ...options } = this.options;
        return options;
    }

    /**
     * Gets the events for the manager.
     *
     * @returns {GuildQueueEvent[] | string[]} The events for the manager.
     */
    public get events(): GuildQueueEvent[] | string[] {
        return this.cmd.events ?? [];
    }

    /**
     * Gets the extractors for the manager.
     *
     * @returns {ExtractorExecutionContext} The extractors for the manager.
     */
    public get extractors(): ExtractorExecutionContext {
        return this.player.extractors;
    }

    /**
     * Gets the player instance.
     *
     * @returns {Player} The player instance.
     */
    public get player(): Player {
        return this.#player;
    }

    /**
     * Gets the discord client instance.
     *
     * @returns {Client} The discord client instance.
     */
    public get client(): Client {
        return this.#client;
    }
}
