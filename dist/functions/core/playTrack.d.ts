import { Functions } from '../../utils/Functions';
export default class PlayTrack extends Functions {
    constructor();
    execute(d: any, [query, engine, channel]: [string, string | undefined, string | undefined], data: any): Promise<any>;
}
