interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

class Cache {
  private store: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTLSeconds: number = 600) {
    this.defaultTTL = defaultTTLSeconds;
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds ?? this.defaultTTL;
    const expiresAt = Date.now() + ttl * 1000;
    this.store.set(key, { data, expiresAt });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(prefix?: string): void {
    if (prefix) {
      const keysToDelete = Array.from(this.store.keys()).filter((key) =>
        key.startsWith(prefix),
      );
      
      keysToDelete.forEach((key) => this.store.delete(key));
    } else {
      this.store.clear();
    }
  }
}

export const cache = new Cache(600);
