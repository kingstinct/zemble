export function times<T = unknown>(length: number, cb: (index: number) => T): readonly T[] {
  return Array.from({ length }, (_, index) => cb(index))
}

export default times
