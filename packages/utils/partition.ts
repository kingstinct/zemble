export function partition<T>(
  collection: readonly T[],
  predicate: (t: T, index: number) => boolean,
) {
  return collection.reduce<readonly [T[], T[]]>(
    (result, value, index) => {
      result[predicate(value, index) ? 0 : 1].push(value)
      return result
    },
    [[], []],
  )
}

export default partition
