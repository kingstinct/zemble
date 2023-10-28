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
      // @ts-expect-error could be improved
      const pVal = prev[key]
      // @ts-expect-error could be improved
      const oVal = obj[key]

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        // @ts-expect-error could be improved
        // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unsafe-argument
        prev[key] = pVal.concat(...oVal)
      } else if (isObject(pVal) && isObject(oVal)) {
        // @ts-expect-error could be improved
        // eslint-disable-next-line no-param-reassign
        prev[key] = mergeDeep(pVal as Record<string, unknown>, oVal as Record<string, unknown>)
      } else {
        // @ts-expect-error could be improved
        // eslint-disable-next-line no-param-reassign
        prev[key] = oVal
      }
    })

    return prev
  }, {} as TType)
}

export default mergeDeep
