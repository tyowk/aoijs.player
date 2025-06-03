// importing the modules
import { AoiClient } from 'aoi.js';
import { Manager, Events } from '..';
import { YoutubeiExtractor } from 'discord-player-youtubei';

// initialize the client instance
const client = new AoiClient({
    token: process.env.TOKEN ?? '',
    prefix: '?',
    cache: {},
    disableAoiDB: true,
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'GuildMembers', 'MessageContent'],
    events: ['onMessage', 'onVoiceStateUpdate']
});

// initialize the manager instance
const manager = new Manager(client, {
    events: [Events.PlayerStart]
});

// registering youtube extractor
manager.register(YoutubeiExtractor, {});

// trackStart event
manager.command({
    type: Events.PlayerStart,
    channel: '$channelId',
    code: 'Started playing at <#$voiceId>'
});

// play command
// @ts-ignore
client.command({
    name: 'play',
    code: '$playTrack[$message;spotifySearch]'
});
