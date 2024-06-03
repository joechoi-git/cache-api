import { saveCacheToFile, loadCacheFromFile, saveInterval } from "../utils/file";
import { Cache, CacheEntry } from "./types";

class timeToLiveCache<T> implements Cache<T> {
    private cache: Map<string, CacheEntry<T>>;
    private expiration: number;
    private type: string = "ttl";

    constructor(expiration: number = 10000) {
        this.cache = new Map();
        this.expiration = expiration;

        const savedData = loadCacheFromFile(this.type);
        if (savedData) {
            this.load(savedData);
        }

        setInterval(() => this.save(), saveInterval);
        setInterval(() => this.cleanup(), saveInterval);
    }

    create(key: string, value: T): void {
        this.cache.set(key, { value, timestamp: Date.now() });
        this.cleanup();
    }

    get(key: string): T | undefined {
        this.cleanup();
        const item = this.cache.get(key);
        if (item) {
            item.timestamp = Date.now();
            return item.value;
        }
        return undefined;
    }

    update(key: string, value: T): void {
        this.create(key, value);
    }

    search(value: T): { [key: string]: T } {
        this.cleanup();
        const results: { [key: string]: T } = {};
        for (const [k, v] of this.cache.entries()) {
            if (typeof v.value === "string" && typeof value === "string") {
                if ((v.value as string).toLowerCase().includes((value as string).toLowerCase())) {
                    results[k] = v.value;
                }
            } else if (v.value === value) {
                results[k] = v.value;
            }
        }
        return results;
    }

    remove(key: string): void {
        this.cache.delete(key);
    }

    load(data: [string, { value: T; timestamp: number }][]): void {
        this.cache = new Map(data);
    }

    entries(): [string, { value: T; timestamp: number }][] {
        return Array.from(this.cache.entries());
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > this.expiration) {
                this.cache.delete(key);
            }
        }
    }

    private save(): void {
        saveCacheToFile(this.type, Array.from(this.cache.entries()));
    }
}

export { timeToLiveCache };
