import {afterAll, afterEach, beforeAll, describe, expect, test} from '@jest/globals';
import {Cache} from "./Cache";
import {ConfigProvider} from "../config/ConfigProvider";
import {TYPES} from "../di/types";
import {container} from "../di/container";

const configProvider = container.get<ConfigProvider>(TYPES.ConfigProvider);
const cache = new Cache(configProvider.CACHE_URL);

beforeAll(async () => {
    await cache?.open();
});

afterEach(async () => {
    await cache.client?.flushDb();
});

afterAll(async () => {
    await cache.close();
});

describe("cache tests", () => {
    const key = "test_key", value = "test_value";
    test("should return null if key doesn't exists", async () => {
        expect(await cache.client?.get(key)).toBe(null);
    });
    test("should set value to key and return it", async () => {
        await cache.client?.set(key, value);
        expect(await cache.client?.get(key)).toBe(value);
    });
});