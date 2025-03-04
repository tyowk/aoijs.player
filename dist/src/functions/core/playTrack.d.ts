import { Functions } from '../../utils/Functions';
export default class PlayTrack extends Functions {
    constructor();
    execute(d: any, [channel, query, engine]: [string, string, string | undefined], data: any): Promise<any>;
}
