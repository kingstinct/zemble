export type PromiseOrValue<T> = Promise<T> | T

export type Prettify<T> = {
  readonly [K in keyof T]: T[K]
}
