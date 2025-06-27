"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const Collective_1 = require("../utils/Collective");
const interpreter = require('aoi.js/src/core/interpreter');
const Functions_1 = require("../utils/Functions");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const discord_player_1 = require("discord-player");
class Commands {
    manager;
    client;
    events = [];
    constructor(manager, events) {
        this.manager = manager;
        this.client = manager.client;
        this.loadFunctions();
        if (Array.isArray(events)) {
            this.events = events.filter((e) => {
                return Object.values(discord_player_1.GuildQueueEvent).includes(e);
            });
            if (this.events.length) {
                for (const event of this.events) {
                    if (this[event] instanceof Collective_1.Collective)
                        continue;
                    this[event] = new Collective_1.Collective();
                    this.#bindEvents(event);
                }
            }
        }
    }
    #bindEvents(event) {
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
                        this.client.channels.cache.get((await interpreter(this.client, { guild, channel, member, author }, [], { code: cmd.channel, name: 'NameParser' }, undefined, true, undefined, {
                            queue,
                            other: args
                        }))?.code) ?? null;
                }
                if (!channel)
                    channel = queue.metadata.text;
                if (!guild)
                    guild = queue.guild;
                await this.manager.player.context.provide({ guild }, async () => {
                    await interpreter(this.client, { guild, channel, member, author }, [], cmd, undefined, false, channel, {
                        queue,
                        other: args
                    });
                });
            }
        });
        return this;
    }
    loadFunctions(basePath = (0, node_path_1.join)(__dirname, '..', 'functions')) {
        const files = (0, node_fs_1.readdirSync)(basePath);
        for (const file of files) {
            const filePath = (0, node_path_1.join)(basePath, file);
            const stat = (0, node_fs_1.lstatSync)(filePath);
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
                        params: func.params,
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
