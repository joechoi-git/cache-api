import { Request, Response } from "express";
import { leastRecentlyUsedCache } from "../cache/leastRecentlyUsedCache";
import { timeToLiveCache } from "../cache/timeToLiveCache";

const getInstance = (
    type: string,
    lruCache: leastRecentlyUsedCache<any>,
    ttlCache: timeToLiveCache<any>
) => {
    if (type === "ttl") {
        return ttlCache;
    } else {
        return lruCache;
    }
};

export const create = (
    req: Request,
    res: Response,
    lruCache: leastRecentlyUsedCache<any>,
    ttlCache: timeToLiveCache<any>
): void => {
    const { key, value } = req.body;
    const { type } = req.params;
    if (!key || !value || !type) {
        res.status(400).send({ message: "Missing required fields" });
        return;
    }
    const cache = getInstance(type, lruCache, ttlCache);
    cache.create(key, value);
    res.send({ message: "Created" });
};

export const get = (
    req: Request,
    res: Response,
    lruCache: leastRecentlyUsedCache<any>,
    ttlCache: timeToLiveCache<any>
): void => {
    const { key, type } = req.params;
    if (!key || !type) {
        res.status(400).send({ message: "Missing required fields" });
        return;
    }
    const cache = getInstance(type, lruCache, ttlCache);
    const value = cache.get(key);
    if (value !== undefined) {
        res.send({ value });
    } else {
        res.status(404).send({ message: "Not found" });
    }
};

export const update = (
    req: Request,
    res: Response,
    lruCache: leastRecentlyUsedCache<any>,
    ttlCache: timeToLiveCache<any>
): void => {
    const { key, type } = req.params;
    const { value } = req.body;
    if (!key || !value || !type) {
        res.status(400).send({ message: "Missing required fields" });
        return;
    }
    const cache = getInstance(type, lruCache, ttlCache);
    cache.update(key, value);
    res.send({ message: "Updated" });
};

export const search = (
    req: Request,
    res: Response,
    lruCache: leastRecentlyUsedCache<any>,
    ttlCache: timeToLiveCache<any>
): void => {
    const { value } = req.query;
    const { type } = req.params;
    if (!value || !type) {
        res.status(400).send({ message: "Missing required fields" });
        return;
    }
    const cache = getInstance(type, lruCache, ttlCache);
    const results = cache.search(value as any);
    res.send({ results });
};

export const remove = (
    req: Request,
    res: Response,
    lruCache: leastRecentlyUsedCache<any>,
    ttlCache: timeToLiveCache<any>
): void => {
    const { key, type } = req.params;
    if (!key || !type) {
        res.status(400).send({ message: "Missing required fields" });
        return;
    }
    const cache = getInstance(type, lruCache, ttlCache);
    cache.remove(key);
    res.send({ message: "Deleted" });
};
