/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable @typescript-eslint/require-await */

import { IStandardKeyValueService } from '..'

const inMemoryMaps: Record<string, Map<string, unknown>> = {}

class KeyValue<T> extends IStandardKeyValueService<T> {
  keys(): readonly string[] {
    return Array.from(this.internalMap.keys())
  }

  values(): readonly T[] {
    return Array.from(this.internalMap.values())
  }

  entries(): readonly (readonly [string, T])[] {
    return Array.from(this.internalMap.entries())
  }

  private readonly prefix: string

  constructor(prefix: string) {
    super()
    this.prefix = prefix
    inMemoryMaps[prefix] = inMemoryMaps[prefix] ?? new Map()
  }

  private get internalMap(): Map<string, T> {
    return inMemoryMaps[this.prefix] as Map<string, T>
  }

  set(key: string, value: T, expireAfterSeconds?: number): void {
    this.internalMap.set(key, value)

    if (expireAfterSeconds) {
      setTimeout(() => {
        this.internalMap.delete(key)
      }, expireAfterSeconds * 1000)
    }
  }

  get(key: string): T | null {
    return this.internalMap.get(key) ?? null
  }

  has(key: string): boolean {
    return this.internalMap.has(key)
  }

  delete(key: string): void {
    this.internalMap.delete(key)
  }

  size(): number {
    return this.internalMap.size
  }

  clear(): void {
    this.internalMap.clear()
  }
}

export { KeyValue }

export default KeyValue
