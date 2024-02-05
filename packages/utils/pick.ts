export function pick<T, TKey extends keyof T>(object: T, keys: readonly TKey[]): Pick<T, TKey> {
  return keys.reduce((acc, key) => {
    if (object[key]) {
      return { ...acc, [key]: object[key] }
    }
    return acc
  }, {} as Pick<T, TKey>)
}

export default pick
