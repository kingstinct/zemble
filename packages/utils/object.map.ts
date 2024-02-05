interface Object {
  map<T, TOut>(this: T, mapper: (value: T) => TOut): TOut;
}

// eslint-disable-next-line functional/immutable-data, no-extend-native
Object.defineProperty(Object.prototype, 'map', {
  // @ts-expect-error sdfsdf
  value(mapper) {
    return mapper(this)
  },
  configurable: true,
  writable: false,
  enumerable: false, // <-- we don't want to mess with for...in loops
})
