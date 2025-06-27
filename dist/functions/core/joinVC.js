"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("../../utils/Functions");
const typings_1 = require("../../typings");
const discord_player_1 = require("discord-player");
const discord_js_1 = require("discord.js");
class JoinVC extends Functions_1.Functions {
    constructor() {
        super({
            name: '$joinVC',
            description: 'This function will make the bot join a voice channel and play music.',
            brackets: false,
            fields: [
                {
                    name: 'channelId',
                    description: 'The channel ID to join.',
                    type: typings_1.ParamType.String,
                    required: false
                },
                {
                    name: 'deaf',
                    description: 'Whether to deaf the bot or not',
                    type: typings_1.ParamType.String,
                    required: false
                }
            ]
        });
    }
    async execute(d, [channel, deaf = true], data) {
        const voiceChannel = channel
            ? (d.client.channels.cache.get(channel) ?? (await d.client.channels.fetch(channel).catch(() => null)))
            : d.member?.voice?.channel;
        if (!voiceChannel && channel)
            return this.error('Invalid voice channel ID provided.');
        if (!voiceChannel)
            return this.error('You must be in a voice channel or provide a valid channel ID.');
        if (voiceChannel.type !== discord_js_1.ChannelType.GuildVoice && voiceChannel.type !== discord_js_1.ChannelType.GuildStageVoice)
            return this.error(`Invalid channel type: ${discord_js_1.ChannelType[voiceChannel.type]}, must be a voice or stage channel.`);
        const player = (0, discord_player_1.useMainPlayer)();
        const connectOptions = d.client.manager.connectOptions ?? {};
        const connectionOptionsUnion = {
            metadata: { text: d.channel },
            ...connectOptions
        };
        try {
            const queue = player.nodes.create(voiceChannel.guild, connectionOptionsUnion);
            await queue.connect(voiceChannel, {
                deaf: deaf === true
            });
        }
        catch (e) {
            return this.error(`Failed to join voice channel with reason: ${e.message}`, {});
        }
        return {
            code: d.util.setCode(data)
        };
    }
}
exports.default = JoinVC;
