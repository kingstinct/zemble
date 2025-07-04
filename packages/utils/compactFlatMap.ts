export function compactFlatMap<T, R>(
  array: readonly T[],
  mapper: (value: T, index: number, array: readonly T[]) => R,
): readonly NonNullable<FlatArray<R, 1>>[] {
  return array.flatMap((value, index, arr) => {
    const mapped = mapper(value, index, arr)
    if (mapped == null) {
      return []
    }
    if (Array.isArray(mapped)) {
      return mapped.filter(
        (item): item is NonNullable<FlatArray<R, 1>> => item != null,
      )
    }
    return [mapped as NonNullable<FlatArray<R, 1>>]
  })
}

export default compactFlatMap
