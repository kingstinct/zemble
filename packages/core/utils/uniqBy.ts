export const uniqBy = <T>(arr: readonly T[], key: keyof T): readonly T[] => Object.values(
  arr.reduce(
    (map, item) => ({
      ...map,
      [`${item[key]}`]: item,
    }),
    {},
  ),
)
