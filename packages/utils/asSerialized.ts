import type { Serialized } from './Serialized'

export function asSerialized<T>(something: T): Serialized<T> {
  return something as Serialized<T>
}
