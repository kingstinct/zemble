export function pickBy<T extends Record<string, unknown>, TKey extends keyof T>(
  object: T,
  predicate: (value: T[TKey], key: TKey) => boolean,
): Partial<T> {
  const obj = { ...object }
  for (const key in obj) {
    // @ts-ignore
    if (!predicate(obj[key], key)) {
      delete obj[key]
    }
  }

  return obj
}

export default pickBy
