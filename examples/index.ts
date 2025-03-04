// importing the modules
import { AoiClient } from 'aoi.js';
import { Manager, PlayerEvents } from '../src';
import { YoutubeiExtractor } from 'discord-player-youtubei'

// initialize the client instance
const client = new AoiClient({
    token: process.env.TOKEN ?? '',
    prefix: '?',
    cache: {},
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'GuildMembers', 'MessageContent'],
    events: ['onMessage', 'onVoiceStateUpdate']
});

// initialize the manager instance
const manager = new Manager(client, {
    events: [
        PlayerEvents.TrackStart,
    ]
});

// registering youtube extractor
manager.register(YoutubeiExtractor, {});

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
    code: '$playTrack[$voiceId;$message;spotifySearch]'
});
