import fs from "fs";
import path from "path";

const dataDirectory = path.resolve(__dirname, "../../data");
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);
}

export const saveInterval = 5000; // automatically to disk save every 5 seconds

export const saveCacheToFile = (type: string, data: any) => {
    const fileName = `${type}-cache.json`;
    const filePath = path.join(dataDirectory, fileName);
    console.log(`> saving to ${fileName}`, data);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

export const loadCacheFromFile = (type: string): any => {
    const fileName = `${type}-cache.json`;
    const filePath = path.join(dataDirectory, fileName);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        console.log(`> loading from ${fileName}`, data);
        return JSON.parse(data);
    }
    return null;
};

export const deleteCacheFiles = () => {
    const lruCacheFile = path.join(dataDirectory, "lru-cache.json");
    const ttlCacheFile = path.join(dataDirectory, "ttl-cache.json");
    if (fs.existsSync(lruCacheFile)) {
        console.log(`> deleting ${lruCacheFile}`);
        fs.unlinkSync(lruCacheFile);
    }
    if (fs.existsSync(ttlCacheFile)) {
        console.log(`> deleting ${ttlCacheFile}`);
        fs.unlinkSync(ttlCacheFile);
    }
};
