/* eslint-disable @typescript-eslint/require-await */

class KeyValue<T> {
  private readonly namespace: string

  readonly internalMap = new Map<string, T>()

  constructor(namespace: string) {
    this.namespace = namespace
  }

  private getNamespacedKey(key: string): string {
    return `${this.namespace}:${key}`
  }

  async set(key: string, value: T, expireAfterSeconds?: number): Promise<void> {
    const namespacedKey = this.getNamespacedKey(key)

    this.internalMap.set(namespacedKey, value)

    if (expireAfterSeconds) {
      setTimeout(() => {
        this.internalMap.delete(namespacedKey)
      }, expireAfterSeconds * 1000)
    }
  }

  async get(key: string): Promise<T | null> {
    return this.internalMap.get(this.getNamespacedKey(key)) ?? null
  }

  async has(key: string): Promise<boolean> {
    return this.internalMap.has(this.getNamespacedKey(key))
  }

  async delete(key: string): Promise<void> {
    this.internalMap.delete(this.getNamespacedKey(key))
  }

  async size(): Promise<number> {
    return this.internalMap.size
  }

  async clear(): Promise<void> {
    this.internalMap.clear()
  }
}

export default KeyValue
