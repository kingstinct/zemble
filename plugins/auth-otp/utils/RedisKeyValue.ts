import createClient from '../clients/redis'
import plugin from '../plugin'

import type Redis from 'ioredis'

class RedisKeyValue<T> {
  private readonly client: Redis

  private readonly namespace: string

  constructor(namespace: string) {
    this.client = new createClient(
      plugin.config.REDIS_URL,
      plugin.config.REDIS_OPTIONS,
    )
    this.namespace = namespace
  }

  private getNamespacedKey(key: string): string {
    return `${this.namespace}:${key}`
  }

  async set(key: string, value: T, expireAfterSeconds?: number): Promise<void> {
    const namespacedKey = this.getNamespacedKey(key)
    const stringValue = JSON.stringify(value)

    await (expireAfterSeconds
      ? this.client.set(namespacedKey, stringValue, 'EX', expireAfterSeconds)
      : this.client.set(namespacedKey, stringValue))
  }

  async get(key: string): Promise<T | null> {
    const value = await this.client.get(this.getNamespacedKey(key))
    return value ? JSON.parse(value) : null
  }

  async has(key: string): Promise<boolean> {
    const value = await this.client.get(this.getNamespacedKey(key))
    return value !== null
  }

  async size(): Promise<number> {
    const keys = await this.client.keys(`${this.namespace}:*`)
    return keys.length
  }

  async delete(key: string): Promise<void> {
    await this.client.del(this.getNamespacedKey(key))
  }

  async clear(): Promise<void> {
    const keys = await this.client.keys(`${this.namespace}:*`)
    if (keys.length > 0) {
      await this.client.del(...keys)
    }
  }
}

export default RedisKeyValue
