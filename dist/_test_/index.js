"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aoi_js_1 = require("aoi.js");
const __1 = require("..");
const client = new aoi_js_1.AoiClient({
    token: process.env.TOKEN ?? '',
    prefix: '!',
    cache: {},
    disableAoiDB: true,
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'MessageContent'],
    events: ['onMessage', 'onVoiceStateUpdate']
});
const manager = new __1.Manager(client, {
    events: [__1.Events.PlayerStart]
});
manager.command({
    type: __1.Events.PlayerStart,
    channel: '$channelId',
    code: 'Started playing at <#$voiceId>'
});
client.command({
    name: 'eval',
    code: '$eval[$message]'
});
