"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aoi_js_1 = require("aoi.js");
const src_1 = require("../src");
const discord_player_youtubei_1 = require("discord-player-youtubei");
const extractor_1 = require("@discord-player/extractor");
const client = new aoi_js_1.AoiClient({
    token: process.env.TOKEN ?? '',
    prefix: '?',
    cache: {},
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'GuildMembers', 'MessageContent'],
    events: ['onMessage', 'onVoiceStateUpdate']
});
const manager = new src_1.Manager(client);
manager.player.extractors.loadMulti(extractor_1.DefaultExtractors);
manager.player.extractors.register(discord_player_youtubei_1.YoutubeiExtractor, {});
// @ts-ignore
client.command({
    name: 'play',
    code: '$playTrack[$voiceId;$message;youtube]'
});
