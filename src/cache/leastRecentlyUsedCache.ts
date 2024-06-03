import { saveCacheToFile, loadCacheFromFile, saveInterval } from "../utils/file";
import { Cache, CacheEntry } from "./types";

class leastRecentlyUsedCache<T> implements Cache<T> {
    private cache: Map<string, CacheEntry<T>>;
    private max: number;
    private type: string = "lru";

    constructor(max: number = 10) {
        this.cache = new Map();
        this.max = max;

        const savedData = loadCacheFromFile(this.type);
        if (savedData) {
            this.load(savedData);
        }

        setInterval(() => this.save(), saveInterval);
    }

    create(key: string, value: T): void {
        const now = Date.now();
        if (this.cache.size === this.max) {
            let oldestKey: string | undefined = undefined;
            let oldestTimestamp = Infinity;

            for (const [k, v] of this.cache.entries()) {
                if (v.timestamp < oldestTimestamp) {
                    oldestTimestamp = v.timestamp;
                    oldestKey = k;
                }
            }

            if (oldestKey !== undefined) {
                this.cache.delete(oldestKey);
            }
        }
        this.cache.set(key, { value, timestamp: now });
    }

    get(key: string): T | undefined {
        if (!this.cache.has(key)) {
            return undefined;
        }
        const entry = this.cache.get(key);
        if (entry) {
            const now = Date.now();
            this.cache.set(key, { value: entry.value, timestamp: now });
            return entry.value;
        }
        return undefined;
    }

    update(key: string, value: T): void {
        this.create(key, value);
    }

    search(value: T): { [key: string]: T } {
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

    private save(): void {
        saveCacheToFile(this.type, Array.from(this.cache.entries()));
    }
}

export { leastRecentlyUsedCache };
