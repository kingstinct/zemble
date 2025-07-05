import type { PartialDeep } from 'type-fest'

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 */
export function mergeDeep<TType extends Record<string, unknown>>(
  ...objects: readonly PartialDeep<TType>[]
) {
  function isObject<T>(obj: T) {
    return obj && typeof obj === 'object'
  }

  return objects.reduce((prev, objIn) => {
    const obj: Record<string, unknown> = objIn
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key]

      const oVal = obj[key]

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        // @ts-expect-error - this is a valid assignment
        prev[key] = pVal.concat(...oVal)
      } else if (isObject(pVal) && isObject(oVal)) {
        // @ts-expect-error - this is a valid assignment
        prev[key] = mergeDeep(
          pVal as PartialDeep<TType>,
          oVal as PartialDeep<TType>,
        )
      } else {
        // @ts-expect-error - this is a valid assignment
        prev[key] = oVal
      }
    })

    return prev as TType
  }, {} as TType)
}

export default mergeDeep
