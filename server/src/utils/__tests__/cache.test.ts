import { cache } from "@utils/cache";

describe("Cache", () => {
  beforeEach(() => {
    cache.clear();
  });

  test("should set and get a value", () => {
    cache.set("key1", "value1");

    expect(cache.get("key1")).toBe("value1");
  });

  test("should return null for non-existent key", () => {
    expect(cache.get("non-existent")).toBeNull();
  });

  test("should overwrite existing key", () => {
    cache.set("key1", "value1");
    cache.set("key1", "value2");

    expect(cache.get("key1")).toBe("value2");
  });

  test("should delete a key", () => {
    cache.set("key1", "value1");
    cache.delete("key1");

    expect(cache.get("key1")).toBeNull();
  });

  test("should clear all keys", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.clear();

    expect(cache.get("key1")).toBeNull();
    expect(cache.get("key2")).toBeNull();
  });

  test("should clear keys by prefix", () => {
    cache.set("user:1", "A");
    cache.set("user:2", "B");
    cache.set("admin:1", "C");
    cache.clear("user:");

    expect(cache.get("user:1")).toBeNull();
    expect(cache.get("user:2")).toBeNull();
    expect(cache.get("admin:1")).toBe("C");
  });

  test("should respect TTL", async () => {
    cache.set("key1", "value1", 1);

    expect(cache.get("key1")).toBe("value1");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    expect(cache.get("key1")).toBeNull();
  });

  test("should store objects correctly", () => {
    const object = { name: "test", value: 42 };

    cache.set("object", object);
    const result = cache.get("object");

    expect(result).toEqual(object);
  });

  test("should store arrays correctly", () => {
    const array = [1, 2, 3];

    cache.set("array", array);
    const result = cache.get("array");

    expect(result).toEqual(array);
  });

  test("should handle null values", () => {
    cache.set("nullKey", null);

    expect(cache.get("nullKey")).toBeNull();
  });
});
