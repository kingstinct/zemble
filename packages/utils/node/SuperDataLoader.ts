type DataLoaderWithKeyFunction<T, TKey> = {
  readonly batchLoadFn: (keys: readonly TKey[]) => Promise<readonly T[]> | readonly T[],
  readonly cacheKeyFn?: (key: TKey) => string,
  readonly chunkSize?: number
}

async function dealWithKeys<T, TKey = string>(
  keys: readonly ((readonly [TKey, string]))[],
  batchLoadFn: (keys: readonly TKey[]) => Promise<readonly T[]> | readonly T[],
  // eslint-disable-next-line functional/prefer-readonly-type
  dataCache: Map<string, unknown>,
) {
  const originalKeys = keys.map(([key]) => key!)
  const results = await batchLoadFn(
    originalKeys,
  )

  if (results.length !== keys.length) {
    throw new Error('batchLoadFn error: returned array length has to be the same length as the keys length')
  }

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < results.length; index++) {
    const value = results[index]!
    const [, keyStr] = keys[index]!
    dataCache.set(
      keyStr!,
      value,
    )
  }
}

export function createSuperDataLoader<T, TKey = string>({
  batchLoadFn,
  cacheKeyFn,
  chunkSize,
}: DataLoaderWithKeyFunction<T, TKey>) {
  const dataCache = new Map<string, T>()
  const resolvedKeys = new Map<TKey, string>()
  const resolvedKeysReverse = new Map<string, TKey>()
  const keysToResolveOnNextTick = new Map<string, TKey>()
  let onNextTick: Promise<void> | undefined

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const prepareNextTick = () => new Promise<void>((resolve) => {
    process.nextTick(async () => {
      const shouldChunk = chunkSize && keysToResolveOnNextTick.size > chunkSize
      const keys = Array.from(keysToResolveOnNextTick.entries())

      if (shouldChunk) {
        // eslint-disable-next-line no-plusplus
        while (keys.length > 0) {
        // eslint-disable-next-line functional/immutable-data
          const nextKeys = keys.splice(0, chunkSize)
          // eslint-disable-next-line no-await-in-loop
          await dealWithKeys(
            // @ts-expect-error sdf sdf
            nextKeys,
            batchLoadFn,
            dataCache,
          )
        }
      } else {
        await dealWithKeys(
          // @ts-expect-error sdf sdf
          keys,
          batchLoadFn,
          dataCache,
        )
      }

      keysToResolveOnNextTick.clear()

      resolve()
    })
  })

  const defaultCacheKeyFn = (key: TKey) => key as string

  const getKey = (key: TKey) => {
    const cachedKey = resolvedKeys.get(key)
    if (cachedKey) {
      return cachedKey
    }
    const fn = cacheKeyFn ?? defaultCacheKeyFn
    const val = fn(key)
    resolvedKeys.set(key, val)
    resolvedKeysReverse.set(val, key)
    return val
  }

  const doesNotHaveKey = (key: string) => !dataCache.has(key)
  const dataFromCache = (key: string) => dataCache.get(key)

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const loadMany = (keys: readonly TKey[]) => {
    const serializedKeys = keys.map(getKey)
    const keysWithoutCache = serializedKeys.filter(doesNotHaveKey)

    if (keysWithoutCache.length === 0) {
      return serializedKeys.map(dataFromCache)
    }

    if (keysToResolveOnNextTick.size === 0) {
      onNextTick = prepareNextTick()
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keysWithoutCache.length; i++) {
      const keysStr = keysWithoutCache[i]!
      const originalKey = resolvedKeysReverse.get(keysStr)!

      keysToResolveOnNextTick.set(keysStr, originalKey)
    }

    return onNextTick!.then(() => serializedKeys.map(dataFromCache))
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const load = (key: TKey) => {
    const keyStr = getKey(key)

    const valueInCache = dataCache.get(keyStr)

    if (valueInCache) {
      return valueInCache
    }

    if (keysToResolveOnNextTick.size === 0) {
      onNextTick = prepareNextTick()
    }

    keysToResolveOnNextTick.set(keyStr, key)

    return onNextTick!.then(() => dataCache.get(keyStr))
  }

  const clear = (key: TKey) => {
    const keyStr = getKey(key)
    dataCache.delete(keyStr)
  }

  const clearAll = () => {
    dataCache.clear()
  }

  const prime = (key: TKey, value: T) => {
    const keyStr = getKey(key)
    dataCache.set(keyStr, value)
  }

  return {
    load, loadMany, clear, clearAll, prime,
  }
}

export default createSuperDataLoader
