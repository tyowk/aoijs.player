import { AoiClient } from 'aoi.js';
import { Manager, GuildQueueEvents } from '../src';
import { YoutubeiExtractor } from 'discord-player-youtubei'
import { DefaultExtractors } from '@discord-player/extractor';

const client = new AoiClient({
    token: process.env.TOKEN ?? '',
    prefix: '?',
    cache: {},
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'GuildMembers', 'MessageContent'],
    events: ['onMessage', 'onVoiceStateUpdate']
});

const manager = new Manager(client, {
    includeExtractors: DefaultExtractors,
    events: [
        GuildQueueEvents.TrackStart,
    ]
}).register(YoutubeiExtractor, {});

manager.command({
    type: 'trackStart',
    channel: '$channelId',
    code: 'Started playing at <#$voiceId>'
});

// @ts-ignore
client.command({
    name: 'play',
    code: '$playTrack[$voiceId;$message;youtube]'
});
