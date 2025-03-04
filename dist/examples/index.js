"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// importing the modules
const aoi_js_1 = require("aoi.js");
const src_1 = require("../src");
const discord_player_youtubei_1 = require("discord-player-youtubei");
// initialize the client instance
const client = new aoi_js_1.AoiClient({
    token: process.env.TOKEN ?? '',
    prefix: '?',
    cache: {},
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'GuildMembers', 'MessageContent'],
    events: ['onMessage', 'onVoiceStateUpdate']
});
// initialize the manager instance
const manager = new src_1.Manager(client, {
    events: [
        src_1.GuildQueueEvents.TrackStart,
    ]
});
// registering youtube extractor
manager.register(discord_player_youtubei_1.YoutubeiExtractor, {});
// trackStart event
manager.command({
    type: 'trackStart',
    channel: '$channelId',
    code: 'Started playing at <#$voiceId>'
});
// play command
// @ts-ignore
client.command({
    name: 'play',
    code: '$playTrack[$voiceId;$message;youtube]'
});
