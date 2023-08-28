import IKeyValue from './IKeyValue'
import createClient from './redis'

import type Redis from 'ioredis'
import type { RedisOptions } from 'ioredis'

class RedisKeyValue<T> extends IKeyValue<T> {
  async keys() {
    const keys = await this.client.keys(`${this.prefix}:*`)

    return keys.map((key) => key.replace(`${this.prefix}:`, ''))
  }

  async values() {
    const keys = await this.client.keys(`${this.prefix}:*`)
    const values = await this.client.mget(...keys)
    return values.map((value) => JSON.parse(value!))
  }

  async entries() {
    const keys = await this.keys()
    const values = await this.client.mget(...keys)
    return keys.map((key, index) => [key, JSON.parse(values[index]!)] as const)
  }

  private readonly client: Redis

  private readonly prefix: string

  constructor(prefix: string, redisUrl: string, redisOptions?: RedisOptions) {
    super()

    this.client = createClient(
      redisUrl,
      redisOptions,
    )

    this.prefix = `readapt-plugin-kv:${prefix}`
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async set(key: string, value: T, expireAfterSeconds?: number): Promise<void> {
    const prefixdKey = this.getPrefixedKey(key)
    const stringValue = JSON.stringify(value)

    await (expireAfterSeconds
      ? this.client.set(prefixdKey, stringValue, 'EX', expireAfterSeconds)
      : this.client.set(prefixdKey, stringValue))
  }

  async get(key: string): Promise<T | null> {
    const value = await this.client.get(this.getPrefixedKey(key))
    return value ? JSON.parse(value) : null
  }

  async has(key: string): Promise<boolean> {
    const value = await this.client.get(this.getPrefixedKey(key))
    return value !== null
  }

  async size(): Promise<number> {
    const keys = await this.client.keys(`${this.prefix}:*`)
    return keys.length
  }

  async delete(key: string): Promise<void> {
    await this.client.del(this.getPrefixedKey(key))
  }

  async clear(): Promise<void> {
    const keys = await this.client.keys(`${this.prefix}:*`)
    if (keys.length > 0) {
      await this.client.del(...keys)
    }
  }
}

export default RedisKeyValue
