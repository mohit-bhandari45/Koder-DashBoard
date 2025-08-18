import redis from "../config/redisClient.config";

/**
 * Get a value from Redis cache
 * @param key - Redis key
 * @returns Parsed value of type T or null if not found
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch (err) {
    console.error(`Redis getCache error for key ${key}:`, err);
    return null;
  }
}

/**
 * Set a value in Redis cache
 * @param key - Redis key
 * @param value - Value to store of type T
 * @param ttlSeconds - Time to live in seconds (default: 60)
 */
export async function setCache<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
  try {
    const stringValue = JSON.stringify(value);
    await redis.set(key, stringValue, "EX", ttlSeconds);
  } catch (err) {
    console.error(`Redis setCache error for key ${key}:`, err);
  }
}
