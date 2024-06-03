import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { saveCacheToFile } from "./utils/file";
import { leastRecentlyUsedCache } from "./cache/leastRecentlyUsedCache";
import { timeToLiveCache } from "./cache/timeToLiveCache";
import { create, get, update, search, remove } from "./controllers/cache";

// Initialize
const lruCache = new leastRecentlyUsedCache<any>(10);
const ttlCache = new timeToLiveCache<any>(10000);

// Express
const app = express();
app.use(bodyParser.json());

app.post("/cache/:type", (req: Request, res: Response) => create(req, res, lruCache, ttlCache));
app.get("/cache/:type/search", (req: Request, res: Response) =>
    search(req, res, lruCache, ttlCache)
);
app.get("/cache/:type/:key", (req: Request, res: Response) => get(req, res, lruCache, ttlCache));
app.put("/cache/:type/:key", (req: Request, res: Response) => update(req, res, lruCache, ttlCache));
app.delete("/cache/:type/:key", (req: Request, res: Response) =>
    remove(req, res, lruCache, ttlCache)
);

// Listen to port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`> Server is running on port ${port}`);
});

// Handle shutdown
process.on("SIGINT", () => {
    console.log("> Handling shutdown...");
    saveCacheToFile("lru", Array.from(lruCache.entries()));
    saveCacheToFile("ttl", Array.from(ttlCache.entries()));
    server.close(() => {
        process.exit(0);
    });
});

export { app };
