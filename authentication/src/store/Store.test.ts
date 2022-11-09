import {afterAll, afterEach, beforeAll, describe, expect, test} from '@jest/globals';
import {Store} from "./Store";
import {ConfigProvider} from "../config/ConfigProvider";
import {TYPES} from "../di/types";
import {container} from "../di/container";

const configProvider = container.get<ConfigProvider>(TYPES.ConfigProvider);
const store = new Store(configProvider.STORE_URL);

beforeAll(async () => {
    await store?.open();
});

afterEach(async () => {
    await store.client?.flushDb();
});

afterAll(async () => {
    await store.close();
});

describe("store tests", () => {
    const key = "test_key", value = "test_value";
    test("should return null if key doesn't exists", async () => {
        expect(await store.client?.get(key)).toBe(null);
    });
    test("should set value to key and return it", async () => {
        await store.client?.set(key, value);
        expect(await store.client?.get(key)).toBe(value);
    });
});