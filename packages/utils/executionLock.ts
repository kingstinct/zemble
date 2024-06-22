/* eslint-disable no-plusplus */

import wait from './wait'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: readonly any[]) => any;

export function singleExecutionLock<T extends AnyFunction>(fn: T) {
  let isRunning = false
  return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
    if (isRunning) {
      return undefined
    }
    isRunning = true
    try {
      return await fn(...args)
    } finally {
      isRunning = false
    }
  }
}

export function concurrencyExecutionLock<T extends AnyFunction>(fn: T, concurrency = 1, timeout = 1000) {
  let running = 0
  const self = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (running >= concurrency) {
      await wait(timeout)
      return self(...args)
    }
    running++
    try {
      return await fn(...args)
    } finally {
      running--
    }
  }
  return self
}
