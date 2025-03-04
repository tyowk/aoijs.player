import type { Manager } from './Manager';
import { GuildQueueEvent } from 'discord-player';
export class Events {
    private manager: Manager;

    constructor(manager: Manager) {
        this.manager = manager;
        this.#bindEvents(this.manager.player.events);
    }

    #bindEvents(ctx) {
        ctx.on('playerStart', (...args: any) => ctx.emit('trackStart', ...args));
        ctx.on('playerFinish', (...args: any) => ctx.emit('trackEnd', ...args));
        ctx.on('queueDelete', (...args: any) => ctx.emit('queueEnd', ...args));
    }
}
