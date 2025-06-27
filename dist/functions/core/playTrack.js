"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("../../utils/Functions");
const typings_1 = require("../../typings");
const discord_player_1 = require("discord-player");
class PlayTrack extends Functions_1.Functions {
    constructor() {
        super({
            name: '$playTrack',
            description: 'Plays a track from a given url or search query.',
            brackets: true,
            fields: [
                {
                    name: 'query',
                    description: 'The query to search for.',
                    type: typings_1.ParamType.String,
                    required: true
                },
                {
                    name: 'engine',
                    description: 'The engine to use to search for.',
                    type: typings_1.ParamType.String,
                    required: false
                }
            ]
        });
    }
    async execute(d, [query, engine = 'youtube'], data) {
        const queue = (0, discord_player_1.useQueue)(d.guild);
        if (!queue)
            return this.error('There are no active players in this guild.');
        const connectOptions = d.client.manager.connectOptions ?? {};
        const connectionOptionsUnion = {
            metadata: { text: d.channel },
            ...connectOptions
        };
        try {
            await queue.play(query.addBrackets(), {
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
