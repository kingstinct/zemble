export function compactMap<T, R>(
  array: readonly T[],
  mapper: (value: T, index: number, array: readonly T[]) => R,
): readonly NonNullable<R>[] {
  return array
    .map(mapper)
    .filter((value): value is NonNullable<R> => value != null)
}

export default compactMap
