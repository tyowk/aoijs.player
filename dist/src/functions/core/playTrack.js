"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("../../utils/Functions");
const typings_1 = require("../../typings");
const discord_player_1 = require("discord-player");
const discord_js_1 = require("discord.js");
class PlayTrack extends Functions_1.Functions {
    constructor() {
        super({
            name: '$playTrack',
            description: 'Plays a track from a given url or search query.',
            brackets: true,
            fields: [
                {
                    name: 'channel',
                    description: 'The channel to play music.',
                    type: typings_1.ArgType.String,
                    required: true
                },
                {
                    name: 'query',
                    description: 'The query to search for.',
                    type: typings_1.ArgType.String,
                    required: true
                },
                {
                    name: 'engine',
                    description: 'The engine to use to search for.',
                    type: typings_1.ArgType.String,
                    required: false
                }
            ]
        });
    }
    async execute(d, [channel, query, engine = void 0], data) {
        const voiceChannel = d.client.channels.cache.get(channel) ??
            (await d.client.channels.fetch(channel).catch(() => null)) ??
            {};
        if (!voiceChannel)
            return this.error('Invalid voice channel ID provided.');
        if (voiceChannel.type !== discord_js_1.ChannelType.GuildVoice && voiceChannel.type !== discord_js_1.ChannelType.GuildStageVoice)
            return this.error(`Invalid channel type: ${discord_js_1.ChannelType[voiceChannel.type]}, must be a voice or stage channel.`);
        const player = (0, discord_player_1.useMainPlayer)();
        const connectOptions = d.client.manager.connectOptions ?? {};
        const connectionOptionsUnion = {
            metadata: { text: d.channel },
            ...connectOptions
        };
        try {
            await player.play(voiceChannel, query.addBrackets(), {
                nodeOptions: connectionOptionsUnion,
                searchEngine: engine,
                requestedBy: d.author
            });
        }
        catch (e) {
            return this.error(`Failed to play track with reason: ${e.message}`, {});
        }
        return {
            code: d.util.setCode(data)
        };
    }
}
exports.default = PlayTrack;
