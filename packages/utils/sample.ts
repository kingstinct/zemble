export function sample<T>(arr: readonly T[]): T | undefined {
  if (arr.length === 0) {
    return undefined
  }
  const len = arr.length
  return arr[Math.floor(Math.random() * len)] as T
}

export default sample
