export function createKeyMap<T>(items: readonly T[], idKeyOrFn: keyof T | ((item: T) => number | string | symbol)) {
  return new Map<number | string | symbol, T>(items.map((item) => {
    if (idKeyOrFn instanceof Function) {
      return [idKeyOrFn(item), item] as const
    }
    return [item[idKeyOrFn] as number | string | symbol, item] as const
  }))
}

export default createKeyMap
