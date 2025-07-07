declare global {
  interface Object {
    map<T, TOut>(this: T, mapper: (value: T) => TOut): TOut
  }
}

Object.defineProperty(Object.prototype, 'map', {
  value(mapper: (value: unknown) => unknown) {
    return mapper(this)
  },
  configurable: true,
  writable: false,
  enumerable: false, // <-- we don't want to mess with for...in loops
})
