import pick from './pick'

export function logPrettyTable<T, TKey extends keyof T>(data: readonly T[], columns: readonly TKey[]): readonly T[] {
  // eslint-disable-next-line no-console
  console.table(data.map((a) => (columns.length > 0 ? pick(a, columns) : a)))
  return data
}

export default logPrettyTable
