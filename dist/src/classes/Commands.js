"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Commands_instances, _Commands_bindEvents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = exports.GuildQueueEvents = void 0;
const Collective_1 = require("../utils/Collective");
const interpreter = require('aoi.js/src/core/interpreter');
var GuildQueueEvents;
(function (GuildQueueEvents) {
    GuildQueueEvents["TrackStart"] = "trackStart";
    GuildQueueEvents["TrackEnd"] = "trackEnd";
    GuildQueueEvents["QueueEnd"] = "queueEnd";
})(GuildQueueEvents || (exports.GuildQueueEvents = GuildQueueEvents = {}));
class Commands {
    constructor(manager, events) {
        _Commands_instances.add(this);
        this.events = [];
        this.manager = manager;
        this.client = manager.client;
        if (!Array.isArray(events))
            return;
        const _events = events.filter((e) => {
            return Object.values(GuildQueueEvents).includes(e);
        });
        if (_events.length === 0)
            return;
        this.events = _events;
        for (const event of _events) {
            this[event] = new Collective_1.Collective();
            __classPrivateFieldGet(this, _Commands_instances, "m", _Commands_bindEvents).call(this, event);
        }
    }
    add(data) {
        if (!data || typeof data !== 'object')
            return this;
        const command = this[data.type];
        if (!command || !Object.hasOwn(data, 'code'))
            return this;
        command.set(command.size, data);
        return this;
    }
}
exports.Commands = Commands;
_Commands_instances = new WeakSet(), _Commands_bindEvents = function _Commands_bindEvents(event) {
    const commands = this[event];
    if (!commands)
        return;
    this.manager.player.events.on(event, async (queue, ...args) => {
        for (const cmd of commands.values()) {
            if (!cmd)
                continue;
            let guild = queue.guild;
            const author = queue.currentTrack?.requestedBy ?? null;
            const member = guild && author ? (guild.members.cache.get(author.id) ?? null) : null;
            let channel = queue.metadata.text;
            if (cmd.channel.includes('$') && cmd.channel !== '$') {
                channel =
                    this.client.channels.cache.get((await interpreter(this.client, { guild, channel, member, author }, [], { code: cmd.channel, name: 'NameParser' }, undefined, true, undefined, {}))?.code) ?? null;
            }
            if (!channel)
                channel = queue.metadata.text;
            if (!guild)
                guild = queue.guild;
            await interpreter(this.client, { guild, channel, member, author }, [], cmd, undefined, false, channel, {
                queue,
                ...args
            });
        }
    });
};
