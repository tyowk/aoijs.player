import type { Manager } from './Manager';
import { PlayerEventsBefore } from '../typings';

export class Events {
    private manager: Manager;

    constructor(manager: Manager, events: Array<string>) {
        this.manager = manager;
        this.#bindEvents(this.manager.player.events, events ?? []);
    }

    #bindEvents(ctx: any, events: Array<string>): Events {
        if (!events.length || !ctx) return this;
        for (const event of events) {
            ctx.on(PlayerEventsBefore[event], (...args: any) => {
                ctx.emit(event, ...args);
            });
        }

        return this;
    }
}
