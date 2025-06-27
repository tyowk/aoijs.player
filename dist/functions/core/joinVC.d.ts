import { Functions } from '../../utils/Functions';
export default class JoinVC extends Functions {
    constructor();
    execute(d: any, [channel, deaf]: [string, boolean, boolean], data: any): Promise<any>;
}
