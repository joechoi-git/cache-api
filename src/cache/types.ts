export interface Cache<T> {
    create(key: string, value: T): void;
    get(key: string): T | undefined;
    update(key: string, value: T): void;
    search(value: T): { [key: string]: T };
    remove(key: string): void;
    load(data: [string, { value: T; timestamp: number }][]): void;
    entries(): [string, { value: T; timestamp: number }][];
}

export type CacheEntry<T> = { value: T; timestamp: number };
