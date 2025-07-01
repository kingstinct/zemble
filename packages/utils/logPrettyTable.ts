import pick from './pick'

export function logPrettyTable<T, TKey extends keyof T>(data: readonly T[], columns: readonly TKey[]): readonly T[] {
  return data
}

export default logPrettyTable
