import type { GuildNodeCreateOptions, PlayerInitOptions } from 'discord-player';
import type { PlayerEvents } from './enums';

export interface CommandData {
    name?: string;
    type: string;
    code: string;
    [key: string | number | symbol]: any;
}

export interface ManagerOptions extends PlayerInitOptions {
    connectOptions?: Omit<GuildNodeCreateOptions<unknown>, 'metadata'>;
    events?: string[] | PlayerEvents[];
}
