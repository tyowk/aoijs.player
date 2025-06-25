import type { GuildQueueEvent, GuildNodeCreateOptions, PlayerInitOptions } from 'discord-player';
import type { YoutubeiOptions } from 'discord-player-youtubei';
import type { SpotifyExtractorInit as SpotifyOptions } from 'discord-player-spotify';
export interface CommandData {
    name?: string;
    type: keyof typeof GuildQueueEvent | GuildQueueEvent | string;
    code: string;
    [key: string | number | symbol]: any;
}
export interface SoundcloudOptions {
    clientId?: string;
    authToken?: string;
}
export interface YoutubeOptions extends YoutubeiOptions {
}
export interface ManagerOptions extends PlayerInitOptions {
    connectOptions?: Omit<GuildNodeCreateOptions<unknown>, 'metadata'>;
    events?: string[] | GuildQueueEvent[];
    youtube?: YoutubeOptions;
    soundcloud?: SoundcloudOptions;
    spotify?: SpotifyOptions;
}
