import { leastRecentlyUsedCache } from "../src/cache/leastRecentlyUsedCache";
import { timeToLiveCache } from "../src/cache/timeToLiveCache";
import { saveCacheToFile, loadCacheFromFile, deleteCacheFiles } from "../src/utils/file";

describe("Least Recently Used Cache", () => {
    // delete cache files first
    deleteCacheFiles();

    const cache = new leastRecentlyUsedCache<any>(10);

    it("should create and get string", () => {
        cache.create("key1", "value1");
        const value = cache.get("key1");
        expect(value).toBe("value1");
    });

    it("should create and get number", () => {
        cache.create("key2", 42);
        const value = cache.get("key2");
        expect(value).toBe(42);
    });

    it("should update string", () => {
        cache.create("key3", "value3");
        cache.update("key3", "newValue3");
        const value = cache.get("key3");
        expect(value).toBe("newValue3");
    });

    it("should update number", () => {
        cache.create("key4", 99);
        cache.update("key4", 100);
        const value = cache.get("key4");
        expect(value).toBe(100);
    });

    it("should discard least recently used entry", () => {
        for (let i = 0; i < 10; i++) {
            cache.create(`key${i}`, `value${i}`);
        }
        cache.get("key0");
        cache.create("key10", "value10");
        expect(cache.get("key1")).toBeUndefined();
        expect(cache.get("key0")).toBe("value0");
    });

    it("should search by string", () => {
        cache.create("key5", "searchValue1");
        cache.create("key6", "searchValue2");
        const results = cache.search("searchValue");
        expect(results).toEqual({
            key5: "searchValue1",
            key6: "searchValue2"
        });
    });

    it("should search by number", () => {
        cache.create("key7", 123);
        cache.create("key8", 456);
        const results = cache.search(123);
        expect(results).toEqual({
            key7: 123
        });
    });

    it("should save to disk", () => {
        cache.create("key9", "value9");
        saveCacheToFile("lru", Array.from(cache.entries()));
        const loadedData = loadCacheFromFile("lru");
        const newCache = new leastRecentlyUsedCache<any>(10);
        console.log("loadedData", loadedData, loadedData.length);
        newCache.load(loadedData);
        expect(newCache.get("key9")).toBe("value9");
    });
});

describe("Time To Live Cache", () => {
    // delete cache files first
    deleteCacheFiles();

    const cache = new timeToLiveCache<any>(10000);

    it("should create and get string", () => {
        cache.create("key1", "value1");
        const value = cache.get("key1");
        expect(value).toBe("value1");
    });

    it("should create and get number", () => {
        cache.create("key2", 42);
        const value = cache.get("key2");
        expect(value).toBe(42);
    });

    it("should update string", () => {
        cache.create("key3", "value3");
        cache.update("key3", "newValue3");
        const value = cache.get("key3");
        expect(value).toBe("newValue3");
    });

    it("should update number", () => {
        cache.create("key4", 99);
        cache.update("key4", 100);
        const value = cache.get("key4");
        expect(value).toBe(100);
    });

    it("should discard entry after waiting some time", async () => {
        cache.create("key5", "value5");
        await new Promise((resolve) => setTimeout(resolve, 11000));
        const value = cache.get("key5");
        expect(value).toBeUndefined();
    });

    it("should search by string", () => {
        cache.create("key6", "searchValue1");
        cache.create("key7", "searchValue2");
        const results = cache.search("searchValue");
        expect(results).toEqual({
            key6: "searchValue1",
            key7: "searchValue2"
        });
    });

    it("should search by number", () => {
        cache.create("key8", 123);
        cache.create("key9", 456);
        const results = cache.search(123);
        expect(results).toEqual({
            key8: 123
        });
    });

    it("should save to disk", () => {
        cache.create("key10", "value10");
        saveCacheToFile("ttl", Array.from(cache.entries()));
        const loadedData = loadCacheFromFile("ttl");
        const newCache = new timeToLiveCache<any>(10000);
        newCache.load(loadedData);
        expect(newCache.get("key10")).toBe("value10");
    });
});
