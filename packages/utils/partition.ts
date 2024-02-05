export function partition<T>(collection: readonly T[], predicate: (t: T, index: number) => boolean) {
  // eslint-disable-next-line functional/prefer-readonly-type
  return collection.reduce<readonly [T[], T[]]>((result, value, index) => {
    // eslint-disable-next-line functional/immutable-data
    result[predicate(value, index) ? 0 : 1].push(value)
    return result
  }, [[], []])
}

export default partition
