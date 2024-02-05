interface Object {
  pipeTo<T, TOut>(this: T, mapper: (value: T) => TOut): TOut;
}

// eslint-disable-next-line functional/immutable-data, no-extend-native
Object.defineProperty(Object.prototype, 'pipeTo', {
  // @ts-expect-error sdfsdf
  value(mapper) {
    return mapper(this)
  },
  configurable: true,
  writable: false,
  enumerable: false, // <-- we don't want to mess with for...in loops
})
