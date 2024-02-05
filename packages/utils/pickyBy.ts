export function pickBy<T extends Record<string, unknown>, TKey extends keyof T>(object: T, predicate: (value: T[TKey], key: TKey) => boolean): Partial<T> {
  const obj = { ...object }
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!predicate(obj[key], key)) {
      // eslint-disable-next-line functional/immutable-data, no-param-reassign
      delete obj[key]
    }
  }

  return obj
}

export default pickBy
