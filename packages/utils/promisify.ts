type Argument<T> = T extends (arg: infer U, callback: infer X) => unknown ? U : unknown;
type Callback<T> = T extends (arg: infer U, callback: infer X) => unknown ? X : unknown;

export function promisify<
  V,
  S extends(arg: Argument<S>, callback: Callback<S>) => void
>(fn: S): (arg: Argument<S>) => Promise<V> {
  return async (arg: Argument<S>): Promise<V> => new Promise((resolve, reject) => {
    try {
      const callback = (d: V) => {
        resolve(d)
      }
      fn(arg, callback as Callback<typeof fn>)
    } catch (e) {
      reject(e)
    }
  })
}

export default promisify
