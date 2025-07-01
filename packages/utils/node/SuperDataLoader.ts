export type DataLoaderWithKeyFunction<T, TKey> = {
  readonly batchLoadFn: (keys: readonly TKey[]) => Promise<readonly T[]> | readonly T[]
  readonly cacheKeyFn?: (key: TKey) => string
  readonly chunkSize?: number
}

function optimizedMapWithForLoop<TData, TReturn>(data: readonly TData[], mapFn: (data: TData) => TReturn) {
  // eslint-disable-next-line functional/prefer-readonly-type
  const result: TReturn[] = new Array<TReturn>(data.length)

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    // eslint-disable-next-line functional/immutable-data
    result[i] = mapFn(data[i]!)
  }

  return result
}

async function dealWithKeys<T, TKey = string>(
  keys: readonly (readonly [TKey, string])[],
  batchLoadFn: (keys: readonly TKey[]) => Promise<readonly T[]> | readonly T[],
  // eslint-disable-next-line functional/prefer-readonly-type
  dataCache: Map<string, unknown>,
) {
  const originalKeys = optimizedMapWithForLoop(keys, ([originalKey]) => originalKey!)
  const results = await batchLoadFn(originalKeys)

  if (results.length !== keys.length) {
    throw new Error('batchLoadFn error: returned array length has to be the same length as the keys length')
  }

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < results.length; index++) {
    const value = results[index]!
    const [, keyStr] = keys[index]!
    dataCache.set(keyStr!, value)
  }
}

function optimizedFilterWithForLoop<TData>(data: readonly TData[], filterFn: (data: TData) => boolean) {
  // eslint-disable-next-line functional/prefer-readonly-type
  const result: TData[] = [] as TData[]

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    const value = data[i]!
    if (filterFn(value)) {
      // eslint-disable-next-line functional/immutable-data
      result.concat(value)
    }
  }

  return result
}

export function createSuperDataLoader<T, TKey = string>({ batchLoadFn, cacheKeyFn, chunkSize }: DataLoaderWithKeyFunction<T, TKey>) {
  const dataCache = new Map<string, T>()
  const keysToResolveOnNextTick = new Map<string, TKey>()
  let onNextTick: Promise<void> | undefined

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const prepareNextTick = () =>
    new Promise<void>((resolve) => {
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
    const fn = cacheKeyFn ?? defaultCacheKeyFn
    const val = fn(key)
    return val
  }

  type KeyWithOriginal = {
    readonly cacheKey: string
    readonly originalKey: TKey
  }

  const getKeyWithOriginal = (key: TKey): KeyWithOriginal => {
    const fn = cacheKeyFn ?? defaultCacheKeyFn
    const cacheKey = fn(key)
    return { cacheKey, originalKey: key }
  }

  const doesNotHaveKeyWithOriginal = (keyWithOriginal: KeyWithOriginal) => !dataCache.has(keyWithOriginal.cacheKey)
  const dataFromCacheWithOriginal = (keyWithOriginal: KeyWithOriginal) => dataCache.get(keyWithOriginal.cacheKey)

  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const loadMany = (keys: readonly TKey[]) => {
    const cacheKeys = optimizedMapWithForLoop(keys, getKeyWithOriginal)
    const keysWithoutCache = optimizedFilterWithForLoop(cacheKeys, doesNotHaveKeyWithOriginal)

    if (keysWithoutCache.length === 0) {
      return optimizedMapWithForLoop(cacheKeys, dataFromCacheWithOriginal)
    }

    if (keysToResolveOnNextTick.size === 0) {
      onNextTick = prepareNextTick()
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keysWithoutCache.length; i++) {
      const { cacheKey: keyStr, originalKey } = keysWithoutCache[i]!

      keysToResolveOnNextTick.set(keyStr, originalKey)
    }

    return onNextTick!.then(() => optimizedMapWithForLoop(cacheKeys, dataFromCacheWithOriginal))
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
    load,
    loadMany,
    clear,
    clearAll,
    prime,
  }
}

export default createSuperDataLoader
