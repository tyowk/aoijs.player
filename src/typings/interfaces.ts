import type { GuildQueueEvent, GuildNodeCreateOptions, PlayerInitOptions } from 'discord-player';
import type { YoutubeiOptions } from 'discord-player-youtubei';
import type { SpotifyExtractorInit as SpotifyOptions } from 'discord-player-spotify';

/**
 * The command data interface.
 */
export interface CommandData {
    name?: string;
    type: keyof typeof GuildQueueEvent | GuildQueueEvent | string;
    code: string;
    [key: string | number | symbol]: any;
}

/**
 * The soundcloud options interface.
 */
export interface SoundcloudOptions {
    clientId?: string;
    authToken?: string;
}

/**
 * The youtube options interface.
 */
export interface YoutubeOptions extends YoutubeiOptions {}

/**
 * The manager options interface.
 */
export interface ManagerOptions extends PlayerInitOptions, Omit<GuildNodeCreateOptions, 'metadata'> {
    events?: string[] | GuildQueueEvent[];
    youtube?: YoutubeOptions;
    soundcloud?: SoundcloudOptions;
    spotify?: SpotifyOptions;
}
