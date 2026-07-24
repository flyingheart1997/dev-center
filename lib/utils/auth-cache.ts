interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class LRUCache<T> {
  private store = new Map<string, CacheEntry<T>>()

  constructor(
    private maxSize: number,
    private ttlMs: number
  ) {}

  get(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    // Refresh recency by re-inserting at the end
    this.store.delete(key)
    this.store.set(key, entry)
    return entry.value
  }

  set(key: string, value: T): void {
    this.store.delete(key)
    if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value
      if (oldestKey !== undefined) this.store.delete(oldestKey)
    }
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs })
  }

  delete(key: string): void {
    this.store.delete(key)
  }
}

// 5-minute TTL: bounds how long a soft-deleted or role-changed user keeps stale JWT claims.
// Swap to Redis by replacing this class's body with client calls of the same shape.
export function createJwtUserCache<T>() {
  return new LRUCache<T>(1000, 5 * 60 * 1000)
}
