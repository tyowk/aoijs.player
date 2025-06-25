"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const discord_player_1 = require("discord-player");
const extractor_1 = require("@discord-player/extractor");
const Commands_1 = require("./Commands");
const discord_player_youtubei_1 = require("discord-player-youtubei");
const discord_player_soundcloud_1 = require("discord-player-soundcloud");
const discord_player_spotify_1 = require("discord-player-spotify");
const youtubei_js_1 = require("youtubei.js");
youtubei_js_1.Log.setLevel(youtubei_js_1.Log.Level.NONE);
class Manager {
    #player;
    #client;
    #cmd;
    #options;
    constructor(client, options = {}) {
        this.#player = new discord_player_1.Player(client, options);
        this.#client = client;
        this.#client.manager = this;
        this.#cmd = new Commands_1.Commands(this, options.events);
        this.#options = options;
        this.register(discord_player_youtubei_1.YoutubeiExtractor, options.youtube ?? {
            generateWithPoToken: true,
            ...(options.youtube ?? {}),
            streamOptions: {
                useClient: 'WEB_EMBEDDED',
                ...(options.youtube ?? {}).streamOptions
            }
        });
        this.register(discord_player_soundcloud_1.SoundcloudExtractor, options.soundcloud ?? {});
        this.register(discord_player_spotify_1.SpotifyExtractor, options.spotify ?? {});
        this.loadMulti(extractor_1.DefaultExtractors);
    }
    static create(client, options = {}) {
        return new Manager(client, options);
    }
    command(data) {
        this.cmd.add(data);
        return this;
    }
    register(extractor, options) {
        this.extractors.register(extractor, options);
        return this;
    }
    loadMulti(extractors) {
        this.extractors.loadMulti(extractors);
        return this;
    }
    get cmd() {
        return this.#cmd;
    }
    get options() {
        return this.#options;
    }
    get connectOptions() {
        return this.options.connectOptions;
    }
    get events() {
        return this.cmd.events ?? [];
    }
    get extractors() {
        return this.player.extractors;
    }
    get player() {
        return this.#player;
    }
    get client() {
        return this.#client;
    }
}
exports.Manager = Manager;
