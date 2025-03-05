import type { Manager } from '../classes';
import type { FunctionManager } from 'aoi.js';

export * from './interfaces';
export * from './enums';

declare global {
    interface String {
        deleteBrackets(): string;
        addBrackets(): string;
        removeBrackets(): string;
    }
}

declare module 'discord.js' {
    interface Client {
        manager: Manager;
        functionManager: FunctionManager;
    }
}
