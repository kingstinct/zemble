/* eslint-disable functional/immutable-data */
import { useState, useEffect } from 'react'

type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray;

interface JSONObject {
  readonly [x: string]: JSONValue;
}

type ToPrimitive<T> =
  T extends string ? string
    : T extends number ? number
      : T extends boolean ? boolean
        : T;

export type AtomStorage = {
  readonly setItem: (key: string, value: string) => void,
  readonly getItem: (key: string) => string | null
}

export type AtomAsyncStorage = {
  readonly setItem: (key: string, value: string) => Promise<void>,
  readonly getItem: (key: string) => Promise<string | null>
}

interface JSONArray extends Array<JSONValue> { }

export class Atom<T extends JSONValue> {
  /* eslint-disable functional/prefer-readonly-type */
  #value: T

  /* eslint-disable functional/prefer-readonly-type */
  #subscribers: readonly ((newVal: T, prevVal: T) => void)[]

  constructor(initialValue: T) {
    this.#value = initialValue
    this.#subscribers = []
  }

  get value() {
    return this.#value
  }

  get() {
    return this.#value
  }

  addListener(cb: (newVal: T, prevVal: T) => void) {
    this.#subscribers = [...this.#subscribers, cb]
    const remove = () => {
      this.#subscribers = this.#subscribers.filter((fn) => fn !== cb)
    }
    return { remove }
  }

  set(value: (T | ((val: T) => T))) {
    const prevValue = this.#value
    this.#value = typeof value === 'function' ? value(this.#value) : value
    if (this.#value !== prevValue) {
      this.#subscribers.forEach((sub) => {
        sub(this.#value, prevValue)
      })
    }
  }
}

export function createAtom<T extends JSONValue>(initialValue: ToPrimitive<T>) {
  return new Atom<ToPrimitive<T>>(initialValue)
}

export function useAtom<T extends JSONValue>(atom: Atom<T>) {
  const [val, setVal] = useState<T>(atom.value)

  useEffect(() => {
    const { remove } = atom.addListener((newVal) => {
      setVal(newVal)
    })
    return remove
  }, [atom])

  return val
}

const debounce = (fn: () => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(fn, delay)
  }
}

export function persistAtom<T extends JSONValue, TStorage extends AtomStorage | AtomAsyncStorage>(
  atom: Atom<T>,
  key: string,
  Storage: TStorage,
  opts?: { readonly debounce?: number },
): TStorage extends AtomAsyncStorage ? Promise<T | null> : T | null {
  const valueOrPromise = Storage.getItem(key)

  const startSubscribing = () => {
    atom.addListener(debounce(() => {
      void Storage.setItem(key, JSON.stringify(atom.value))
    }, opts?.debounce ?? 100))
  }

  const handleValue = (value: string | null) => {
    if (value) {
      const valueAsJSON = JSON.parse(value) as T

      atom.set(valueAsJSON)

      startSubscribing()

      return valueAsJSON as T
    }

    startSubscribing()

    return null
  }

  if (valueOrPromise instanceof Promise) {
    // @ts-expect-error contained
    return valueOrPromise.then(handleValue)
  }

  // @ts-expect-error contained
  return handleValue(valueOrPromise)
}
