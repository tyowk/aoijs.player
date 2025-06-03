"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// importing the modules
const aoi_js_1 = require("aoi.js");
const __1 = require("..");
const discord_player_youtubei_1 = require("discord-player-youtubei");
// initialize the client instance
const client = new aoi_js_1.AoiClient({
    token: process.env.TOKEN ?? '',
    prefix: '?',
    cache: {},
    disableAoiDB: true,
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'GuildMembers', 'MessageContent'],
    events: ['onMessage', 'onVoiceStateUpdate']
});
// initialize the manager instance
const manager = new __1.Manager(client, {
    events: [__1.Events.PlayerStart]
});
// registering youtube extractor
manager.register(discord_player_youtubei_1.YoutubeiExtractor, {});
// trackStart event
manager.command({
    type: __1.Events.PlayerStart,
    channel: '$channelId',
    code: 'Started playing at <#$voiceId>'
});
// play command
// @ts-ignore
client.command({
    name: 'play',
    code: '$playTrack[$message;spotifySearch]'
});
