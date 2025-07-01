import type { KVNamespace } from '@cloudflare/workers-types'
import { IStandardKeyValueService } from '@zemble/core'

class CloudflareKeyValue<T> extends IStandardKeyValueService<T> {
  async keys() {
    const all = await this.namespace.list({ prefix: this.prefix })
    return all.keys.map((key) => key.name)
  }

  async values() {
    const all = await this.namespace.list({ prefix: this.prefix })
    return Promise.all(
      all.keys.map(async (key) => {
        const val = await this.namespace.get<T>(key.name, 'json')
        return val as T
      }),
    )
  }

  async entries() {
    const all = await this.namespace.list({ prefix: this.prefix })
    return Promise.all(
      all.keys.map(async (key) => {
        const val = await this.namespace.get<T>(key.name, 'json')
        return [key.name, val as T] as const
      }),
    )
  }

  async size(): Promise<number> {
    const all = await this.namespace.list({ prefix: this.prefix })
    return all.keys.length
  }

  async clear(): Promise<void> {
    const all = await this.namespace.list({ prefix: this.prefix })
    if (all.keys.length > 0) {
      await Promise.all(all.keys.map(async (key) => this.namespace.delete(key.name)))
    }
  }

  private readonly namespace: KVNamespace

  private readonly prefix: string

  constructor(namespace: KVNamespace, prefix: string) {
    super()
    this.namespace = namespace
    this.prefix = prefix
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async set(key: string, value: T, expireAfterSeconds?: number): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key)
    const stringValue = JSON.stringify(value)

    await (expireAfterSeconds ? this.namespace.put(prefixedKey, stringValue, { expirationTtl: expireAfterSeconds }) : this.namespace.put(prefixedKey, stringValue))
  }

  async get(key: string): Promise<T | null> {
    const value = await this.namespace.get<T>(this.getPrefixedKey(key), 'json')
    return value
  }

  async has(key: string): Promise<boolean> {
    const value = await this.namespace.get(this.getPrefixedKey(key))
    return value !== null
  }

  async delete(key: string): Promise<void> {
    await this.namespace.delete(this.getPrefixedKey(key))
  }
}

export default CloudflareKeyValue
