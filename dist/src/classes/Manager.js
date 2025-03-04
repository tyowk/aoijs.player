"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Manager_instances, _Manager_player, _Manager_client, _Manager_cmd, _Manager_options, _Manager_loadFunctions;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const discord_player_1 = require("discord-player");
const Commands_1 = require("./Commands");
const Functions_1 = require("../utils/Functions");
const Events_1 = require("./Events");
const path = require("node:path");
const fs = require("node:fs");
class Manager {
    constructor(client, options = {}) {
        _Manager_instances.add(this);
        _Manager_player.set(this, void 0);
        _Manager_client.set(this, void 0);
        _Manager_cmd.set(this, void 0);
        _Manager_options.set(this, void 0);
        __classPrivateFieldSet(this, _Manager_player, new discord_player_1.Player(client, options), "f");
        __classPrivateFieldSet(this, _Manager_client, client, "f");
        __classPrivateFieldGet(this, _Manager_client, "f").manager = this;
        __classPrivateFieldSet(this, _Manager_cmd, new Commands_1.Commands(this, options.events), "f");
        __classPrivateFieldSet(this, _Manager_options, options, "f");
        if (this.options.includeExtractors) {
            this.player.extractors.loadMulti(this.options.includeExtractors);
        }
        new Events_1.Events(this);
        __classPrivateFieldGet(this, _Manager_instances, "m", _Manager_loadFunctions).call(this);
    }
    command(data) {
        this.cmd.add(data);
        return this;
    }
    register(extractor, options) {
        this.player.extractors.register(extractor, options);
        return this;
    }
    get cmd() {
        return __classPrivateFieldGet(this, _Manager_cmd, "f");
    }
    get options() {
        return __classPrivateFieldGet(this, _Manager_options, "f");
    }
    get connectOptions() {
        return this.options.connectOptions;
    }
    get events() {
        return this.options.events;
    }
    get extractors() {
        return this.player.extractors;
    }
    get player() {
        return __classPrivateFieldGet(this, _Manager_player, "f");
    }
    get client() {
        return __classPrivateFieldGet(this, _Manager_client, "f");
    }
}
exports.Manager = Manager;
_Manager_player = new WeakMap(), _Manager_client = new WeakMap(), _Manager_cmd = new WeakMap(), _Manager_options = new WeakMap(), _Manager_instances = new WeakSet(), _Manager_loadFunctions = function _Manager_loadFunctions(basePath = path.join(__dirname, '..', 'functions')) {
    const files = fs.readdirSync(basePath);
    for (const file of files) {
        const filePath = path.join(basePath, file);
        const stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
            __classPrivateFieldGet(this, _Manager_instances, "m", _Manager_loadFunctions).call(this, filePath);
        }
        else if (file.endsWith('.js')) {
            const RawFunction = require(filePath).default;
            if (!RawFunction && !(RawFunction.prototype instanceof Functions_1.Functions))
                continue;
            const func = new RawFunction();
            if (!func.name)
                continue;
            __classPrivateFieldGet(this, _Manager_client, "f").functionManager.createFunction({
                name: func.name,
                type: 'djs',
                code: func.code.bind(func)
            });
        }
    }
};
