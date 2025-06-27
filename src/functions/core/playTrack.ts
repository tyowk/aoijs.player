import { Functions } from '../../utils/Functions';
import { ParamType } from '../../typings';
import { useQueue, type SearchQueryType } from 'discord-player';

export default class PlayTrack extends Functions {
    constructor() {
        super({
            name: '$playTrack',
            description: 'Plays a track from a given url or search query.',
            brackets: true,
            fields: [
                {
                    name: 'query',
                    description: 'The query to search for.',
                    type: ParamType.String,
                    required: true
                },
                {
                    name: 'engine',
                    description: 'The engine to use to search for.',
                    type: ParamType.String,
                    required: false
                }
            ]
        });
    }

    public override async execute(
        d: any,
        [query, engine = 'youtube']: [string, string | undefined],
        data: any
    ): Promise<any> {
        const queue = useQueue(d.guild);
        if (!queue) return this.error('There are no active players in this guild.');
        const connectOptions = d.client.manager.connectOptions ?? {};
        const connectionOptionsUnion = {
            metadata: { text: d.channel },
            ...connectOptions
        };

        try {
            await queue.play(query.addBrackets(), {
                nodeOptions: connectionOptionsUnion,
                searchEngine: engine as (SearchQueryType | `ext:${string}`) | undefined,
                requestedBy: d.author
            });
        } catch (e: any) {
            return this.error(`Failed to play track with reason: ${e.message}`, {});
        }

        return {
            code: d.util.setCode(data)
        };
    }
}
