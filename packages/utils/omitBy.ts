export function omitBy<T extends Record<string, unknown>, TKey extends keyof T>(
  object: T,
  predicate: (value: T[TKey], key: TKey) => boolean,
): Partial<T> {
  for (const key in object) {
    // @ts-ignore
    if (predicate(object[key], key)) {
      delete object[key]
    }
  }

  return { ...object }
}

export default omitBy
