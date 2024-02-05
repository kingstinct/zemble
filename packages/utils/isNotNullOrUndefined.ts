export function isNotNullOrUndefined<T>(data: T): data is NonNullable<T> {
  return typeof data !== 'undefined' && data !== null
}

export default isNotNullOrUndefined
