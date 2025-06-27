// @ts-check
// importing the modules
import { AoiClient } from 'aoi.js';
import { Manager, Events } from '..';

const client = new AoiClient({
    token: process.env.TOKEN ?? '',
    prefix: '!',
    cache: {},
    disableAoiDB: true,
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'MessageContent'],
    events: ['onMessage', 'onVoiceStateUpdate']
});

// initialize the manager instance
const manager = new Manager(client, {
    events: [Events.PlayerStart]
});

// trackStart event
manager.command({
    type: Events.PlayerStart,
    channel: '$channelId',
    code: 'Started playing at <#$voiceId>'
});

// eval command
// @ts-ignore
client.command({
    name: 'eval',
    code: '$eval[$message]'
});
