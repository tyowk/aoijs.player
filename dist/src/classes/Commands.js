"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Commands_instances, _Commands_bindEvents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const Collective_1 = require("../utils/Collective");
const interpreter = require('aoi.js/src/core/interpreter');
const typings_1 = require("../typings");
const Functions_1 = require("../utils/Functions");
const Events_1 = require("./Events");
const path = require("node:path");
const fs = require("node:fs");
class Commands {
    constructor(manager, events) {
        _Commands_instances.add(this);
        this.events = [];
        this.manager = manager;
        this.client = manager.client;
        this.loadFunctions();
        if (Array.isArray(events)) {
            this.events = events.filter((e) => {
                return Object.values(typings_1.PlayerEvents).includes(e);
            });
            if (this.events.length) {
                new Events_1.Events(this.manager, this.events);
                for (const event of this.events) {
                    this[event] = new Collective_1.Collective();
                    __classPrivateFieldGet(this, _Commands_instances, "m", _Commands_bindEvents).call(this, event);
                }
            }
        }
    }
    loadFunctions(basePath = path.join(__dirname, '..', 'functions')) {
        const files = fs.readdirSync(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = fs.lstatSync(filePath);
            if (stat.isDirectory()) {
                this.loadFunctions(filePath);
            }
            else if (file.endsWith('.js')) {
                const RawFunction = require(filePath).default;
                if (!RawFunction && !(RawFunction.prototype instanceof Functions_1.Functions))
                    continue;
                const func = new RawFunction();
                if (!func.name)
                    continue;
                if (typeof func.code === 'function') {
                    this.client.functionManager.createFunction({
                        name: func.name,
                        type: 'djs',
                        code: func.code.bind(func)
                    });
                }
                else if (typeof func.code === 'string') {
                    this.client.functionManager.createFunction({
                        name: func.name,
                        type: 'aoi.js',
                        code: func.code
                    });
                }
            }
        }
        return this;
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
        return this;
    this.manager.player.events.on(event, async (queue, ...args) => {
        for (const cmd of commands.values()) {
            if (!cmd || !cmd.code)
                continue;
            let guild = queue.guild;
            const author = queue.currentTrack?.requestedBy ?? null;
            let channel = queue.metadata.text;
            const member = guild && author ? (guild.members.cache.get(author.id) ?? null) : null;
            if (cmd.channel.includes('$') && cmd.channel !== '$') {
                channel =
                    this.client.channels.cache.get((await interpreter(this.client, { guild, channel, member, author }, [], { code: cmd.channel, name: 'NameParser' }, undefined, true, undefined, {}))?.code) ?? null;
            }
            if (!channel)
                channel = queue.metadata.text;
            if (!guild)
                guild = queue.guild;
            await this.manager.player.context.provide({ guild }, async () => {
                await interpreter(this.client, { guild, channel, member, author }, [], cmd, undefined, false, channel, {
                    queue,
                    ...args
                });
            });
        }
    });
    return this;
};
