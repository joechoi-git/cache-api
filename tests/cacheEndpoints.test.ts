import request from "supertest";
import { app } from "../src/server";
import { deleteCacheFiles } from "../src/utils/file";

describe("Cache API Endpoints", () => {
    // delete cache files first
    deleteCacheFiles();

    it("should create a cache entry", async () => {
        const response = await request(app)
            .post("/cache/lru")
            .send({ key: "key1", value: "value1" });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Created");
    });

    it("should get a cache entry", async () => {
        await request(app).post("/cache/lru").send({ key: "key2", value: "value2" });

        const response = await request(app).get("/cache/lru/key2");
        expect(response.status).toBe(200);
        expect(response.body.value).toBe("value2");
    });

    it("should update a cache entry", async () => {
        await request(app).post("/cache/lru").send({ key: "key3", value: "value3" });

        const response = await request(app).put("/cache/lru/key3").send({ value: "updatedValue3" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Updated");

        const getResponse = await request(app).get("/cache/lru/key3");
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.value).toBe("updatedValue3");
    });

    it("should search for cache entry by value", async () => {
        await request(app).post("/cache/lru").send({ key: "key4", value: "searchValue1" });
        await request(app).post("/cache/lru").send({ key: "key5", value: "searchValue2" });
        await request(app).post("/cache/lru").send({ key: "key6", value: "searchValue3" });

        const response = await request(app).get("/cache/lru/search?value=searchValue");

        expect(response.status).toBe(200);
        expect(response.body.results).toEqual({
            key4: "searchValue1",
            key5: "searchValue2",
            key6: "searchValue3"
        });
    });

    it("should delete a cache entry", async () => {
        await request(app).post("/cache/lru").send({ key: "key6", value: "value6" });

        const response = await request(app).delete("/cache/lru/key6");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Deleted");

        const getResponse = await request(app).get("/cache/lru/key6");
        expect(getResponse.status).toBe(404);
    });

    it("should test time to live cache correctly", async () => {
        await request(app).post("/cache/ttl").send({ key: "key7", value: "ttlValue" });

        const response = await request(app).get("/cache/ttl/key7");

        expect(response.status).toBe(200);
        expect(response.body.value).toBe("ttlValue");

        await new Promise((resolve) => setTimeout(resolve, 11000));

        const expiredResponse = await request(app).get("/cache/ttl/key7");
        expect(expiredResponse.status).toBe(404);
    });
});
