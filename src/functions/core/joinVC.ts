import { Functions } from '../../utils/Functions';
import { ParamType } from '../../typings';
import { useMainPlayer } from 'discord-player';
import { ChannelType } from 'discord.js';

export default class JoinVC extends Functions {
    constructor() {
        super({
            name: '$joinVC',
            description: 'This function will make the bot join a voice channel and play music.',
            brackets: false,
            fields: [
                {
                    name: 'channelId',
                    description: 'The channel ID to join.',
                    type: ParamType.String,
                    required: false
                },
                {
                    name: 'deaf',
                    description: 'Whether to deaf the bot or not',
                    type: ParamType.String,
                    required: false
                }
            ]
        });
    }

    public override async execute(d: any, [channel, deaf = true]: [string, boolean, boolean], data: any): Promise<any> {
        const voiceChannel = channel
            ? (d.client.channels.cache.get(channel) ?? (await d.client.channels.fetch(channel).catch(() => null)))
            : d.member?.voice?.channel;

        if (!voiceChannel && channel) return this.error('Invalid voice channel ID provided.');
        if (!voiceChannel) return this.error('You must be in a voice channel or provide a valid channel ID.');
        if (voiceChannel.type !== ChannelType.GuildVoice && voiceChannel.type !== ChannelType.GuildStageVoice)
            return this.error(
                `Invalid channel type: ${ChannelType[voiceChannel.type]}, must be a voice or stage channel.`
            );

        const player = useMainPlayer();
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
        } catch (e: any) {
            return this.error(`Failed to join voice channel with reason: ${e.message}`, {});
        }

        return {
            code: d.util.setCode(data)
        };
    }
}
