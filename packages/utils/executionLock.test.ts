import {
  describe, expect, it, jest,
} from 'bun:test'

import { concurrencyExecutionLock, singleExecutionLock } from './executionLock'
import wait from './wait'

describe('singleExecutionLock', () => {
  it('should run the function only once', async () => {
    const fn = jest.fn(async () => wait(10))
    const fnLocked = singleExecutionLock(fn)

    await Promise.all([
      fnLocked(),
      fnLocked(),
      fnLocked(),
    ])

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should run the function more if in sequence', async () => {
    const fn = jest.fn()
    const fnLocked = singleExecutionLock(fn)

    await fnLocked()
    await fnLocked()
    await fnLocked()

    expect(fn).toHaveBeenCalledTimes(3)
  })
})

describe('concurrencyExecutionLock', () => {
  it('should run all functions', async () => {
    const fn = jest.fn()
    const fnLocked = concurrencyExecutionLock(fn)

    await fnLocked()
    await fnLocked()
    await fnLocked()

    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('should run the function more if in parallel with timeout', async () => {
    const start = Date.now()
    const fn = jest.fn()
    const fnLocked = concurrencyExecutionLock(fn, 3, 100)

    await Promise.all([
      fnLocked(),
      fnLocked(),
      fnLocked(),
      fnLocked(),
      fnLocked(),
      fnLocked(),
    ])

    const timeConsumed = Date.now() - start

    expect(fn).toHaveBeenCalledTimes(6)
    expect(timeConsumed).toBeGreaterThan(100)
    expect(timeConsumed).toBeLessThan(200)
  })

  it('should run the function more if in parallel with timeout', async () => {
    const start = Date.now()
    const fn = jest.fn()
    const fnLocked = concurrencyExecutionLock(fn, 6, 100)

    await Promise.all([
      fnLocked(),
      fnLocked(),
      fnLocked(),
      fnLocked(),
      fnLocked(),
      fnLocked(),
    ])

    const timeConsumed = Date.now() - start

    expect(fn).toHaveBeenCalledTimes(6)
    expect(timeConsumed).toBeLessThan(50)
  })
})
