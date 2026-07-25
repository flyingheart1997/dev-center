export interface AuthCache<T> {
  get(key: string): Promise<T | null> | T | null
  set(key: string, value: T, ttlMs?: number): Promise<void> | void
  delete(key: string): Promise<void> | void
}

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class MemoryAuthCache<T> implements AuthCache<T> {
  private store = new Map<string, CacheEntry<T>>()

  constructor(
    private maxSize: number = 1000,
    private defaultTtlMs: number = Number(process.env.AUTH_CACHE_TTL) || 30000
  ) {}

  get(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    // Refresh recency
    this.store.delete(key)
    this.store.set(key, entry)
    return entry.value
  }

  set(key: string, value: T, ttlMs?: number): void {
    this.store.delete(key)
    if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value
      if (oldestKey !== undefined) this.store.delete(oldestKey)
    }
    const duration = ttlMs ?? this.defaultTtlMs
    this.store.set(key, { value, expiresAt: Date.now() + duration })
  }

  delete(key: string): void {
    this.store.delete(key)
  }
}

// Global LRU Memory Cache for JWT User claims (configurable via AUTH_CACHE_TTL env)
export function createJwtUserCache<T>(): AuthCache<T> {
  return new MemoryAuthCache<T>(1000)
}
