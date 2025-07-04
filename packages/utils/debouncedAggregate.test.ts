import { describe, expect, it, jest } from 'bun:test'

import debouncedAggregate from './debouncedAggregate'

describe('debouncedAggregate', () => {
  it('Should work', async () => {
    jest.useFakeTimers()
    const callback = jest.fn()
    const debouncer = debouncedAggregate(100, callback)

    debouncer(1)
    debouncer(2)
    debouncer(3)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(callback).toHaveBeenCalledWith([1, 2, 3])
  })

  it('Should work with maxItems', async () => {
    const callback = jest.fn()
    const debouncer = debouncedAggregate(100, callback, { maxItems: 2 })

    debouncer(1)
    debouncer(2)
    debouncer(3)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(callback).toHaveBeenCalledWith([1, 2])
    expect(callback).toHaveBeenCalledWith([3])
  })

  it('Should work with maxMs', async () => {
    const callback = jest.fn()
    const debouncer = debouncedAggregate(200, callback, { maxMs: 275 })

    debouncer(1)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    debouncer(2)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    debouncer(3) // should be called

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(callback).toHaveBeenCalledWith([1, 2, 3])

    debouncer(4)

    await new Promise((resolve) => {
      setTimeout(resolve, 200)
    })

    expect(callback).toHaveBeenCalledWith([4])
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
