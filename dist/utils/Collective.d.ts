export declare class Collective<K, V> extends Map<K, V> {
    create(key: K, value: V): Collective<K, V>;
    filter(fn: (value: V, index: number, array: V[]) => boolean): V[];
    filterKeys(fn: (value: K, index: number, array: K[]) => boolean): K[];
    find(fn: (value: V, index: number, array: V[]) => boolean): V | undefined;
    findKey(fn: (value: K, index: number, array: K[]) => boolean): K | undefined;
    some(fn: (value: V, index: number, array: V[]) => boolean): boolean;
    someKeys(fn: (value: K, index: number, array: K[]) => boolean): boolean;
    every(fn: (value: V, index: number, array: V[]) => boolean): boolean;
    everyKeys(fn: (value: K, index: number, array: K[]) => boolean): boolean;
    has(key: K): boolean;
    get K(): Array<K>;
    get V(): Array<V>;
}
