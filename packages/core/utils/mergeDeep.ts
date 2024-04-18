import type { PartialDeep } from 'type-fest'

/* eslint-disable functional/immutable-data */

/**
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*/
export function mergeDeep<TType extends object>(...objects: readonly PartialDeep<TType>[]) {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function isObject<T>(obj: T) {
    return obj && typeof obj === 'object'
  }

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key]

      const oVal = obj[key]

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unsafe-argument
        prev[key] = pVal.concat(...oVal)
      } else if (isObject(pVal) && isObject(oVal)) {
        // eslint-disable-next-line no-param-reassign
        prev[key] = mergeDeep(pVal as Record<string, unknown>, oVal as Record<string, unknown>)
      } else {
        // eslint-disable-next-line no-param-reassign
        prev[key] = oVal
      }
    })

    return prev
  }, {} as TType)
}

export default mergeDeep
