import { AoiClient } from 'aoi.js';
import { Manager } from '../src';
import { YoutubeiExtractor } from 'discord-player-youtubei'
import { DefaultExtractors } from '@discord-player/extractor';

const client = new AoiClient({
    token: process.env.TOKEN ?? '',
    prefix: '?',
    cache: {},
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'GuildMembers', 'MessageContent'],
    events: ['onMessage', 'onVoiceStateUpdate']
});

const manager = new Manager(client);
manager.player.extractors.loadMulti(DefaultExtractors);
manager.player.extractors.register(YoutubeiExtractor, {});

// @ts-ignore
client.command({
    name: 'play',
    code: '$playTrack[$voiceId;$message;youtube]'
});
