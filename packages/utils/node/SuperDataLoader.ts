type DataLoaderWithStringKey<T> = {
  readonly batchLoadFn: (keys: readonly string[]) => Promise<readonly T[]> | readonly T[],
  readonly cacheKeyFn?: undefined
}

type DataLoaderWithKeyFunction<T, TKey> = {
  readonly batchLoadFn: (keys: readonly TKey[]) => Promise<readonly T[]> | readonly T[],
  readonly cacheKeyFn: (key: TKey) => string
}

export function createSuperDataLoader<T, TKey = string>({
  batchLoadFn,
  cacheKeyFn,
}: DataLoaderWithKeyFunction<T, TKey> | DataLoaderWithStringKey<T>) {
  const dataCache = new Map<string, T>()
  const keysToResolveOnNextTickSet = new Map<string, { readonly key: TKey }>()
  let onNextTick: Promise<void> | undefined

  const prepareNextTick = async () => new Promise<void>((resolve) => {
    process.nextTick(async () => {
      const keys = Array.from(keysToResolveOnNextTickSet.values())

      const results = await batchLoadFn(
        // @ts-expect-error this is already safe
        keys.map((key) => key.key),
      )

      if (results.length !== keysToResolveOnNextTickSet.size) {
        throw new Error('batchLoadFn error: returned array length has to be the same length as the keys length')
      }

      const iter = keysToResolveOnNextTickSet.keys()
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < results.length; index++) {
        const value = results[index]!
        dataCache.set(
          iter.next().value!,
          value,
        )
      }

      keysToResolveOnNextTickSet.clear()

      resolve()
    })
  })

  const getKey = cacheKeyFn || ((key: TKey) => key as string)

  const loadMany = async (keys: readonly TKey[]) => Promise.all(keys.map(load))

  const load = async (key: TKey) => {
    const keyStr = getKey(key)

    const valueInCache = dataCache.get(keyStr)

    if (valueInCache) {
      return valueInCache
    }

    if (keysToResolveOnNextTickSet.size === 0) {
      onNextTick = prepareNextTick()
    }

    keysToResolveOnNextTickSet.set(keyStr, { key })

    await onNextTick

    return dataCache.get(keyStr)
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
