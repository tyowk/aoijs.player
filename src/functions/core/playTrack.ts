import { Functions, ArgType } from '../../utils/Functions';
import { useMainPlayer, type SearchQueryType } from 'discord-player';
import { type VoiceBasedChannel, ChannelType } from 'discord.js';

export default class PlayTrack extends Functions {
    constructor() {
        super({
            name: '$playTrack',
            description: 'Plays a track from a given url or search query.',
            brackets: true,
            fields: [
                {
                    name: 'channel',
                    description: 'The channel to play music.',
                    type: ArgType.String,
                    required: true
                },
                {
                    name: 'query',
                    description: 'The query to search for.',
                    type: ArgType.String,
                    required: true
                },
                {
                    name: 'engine',
                    description: 'The engine to use to search for.',
                    type: ArgType.String,
                    required: false
                }
            ]
        });
    }

    public override async execute(
        d: any,
        [channel, query, engine = void 0]: [string, string, string | undefined],
        data: any
    ): Promise<any> {
        const voiceChannel =
            d.client.channels.cache.get(channel) ??
            (await d.client.channels.fetch(channel).catch(() => null)) ??
            ({} as VoiceBasedChannel);
        if (!voiceChannel) return this.error('Invalid voice channel ID provided.');
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

        let error = false;
        try {
            await player.play(<VoiceBasedChannel>voiceChannel, query.addBrackets(), {
                nodeOptions: connectionOptionsUnion,
                searchEngine: engine as (SearchQueryType | `ext:${string}`) | undefined,
                requestedBy: d.author
            });
        } catch (e: any) {
            error = true;
            return this.error(`Failed to play track with reason: ${e.message}`, {});
        }

        return {
            code: d.util.setCode(data),
            error
        };
    }
}
