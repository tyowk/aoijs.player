import { Collective } from '../utils/Collective';
import type { Manager } from './Manager';
import type { Client } from 'discord.js';
export interface CommandData {
    name?: string;
    type: string;
    code: string;
    [key: string | number | symbol]: any;
}
export declare enum GuildQueueEvents {
    TrackStart = "trackStart",
    TrackEnd = "trackEnd",
    QueueEnd = "queueEnd"
}
declare global {
    interface String {
        deleteBrackets(): string;
        addBrackets(): string;
        removeBrackets(): string;
    }
}
export declare class Commands {
    #private;
    readonly manager: Manager;
    readonly client: Client;
    readonly events: string[];
    trackStart?: Collective<number, CommandData>;
    trackEnd?: Collective<number, CommandData>;
    queueEnd?: Collective<number, CommandData>;
    constructor(manager: Manager, events?: string[]);
    add(data: CommandData): Commands;
}
