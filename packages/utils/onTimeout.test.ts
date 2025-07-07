import { describe, expect, jest, test } from 'bun:test'

import onTimeout from './onTimeout'

describe('onTimeout', () => {
  test('Should execute after timeout', async () => {
    const cb = jest.fn()
    onTimeout(100, cb)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('Should cancel timeout', async () => {
    jest.useFakeTimers()

    const cb = jest.fn()
    const cancel = onTimeout(100, cb)
    cancel()

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(cb).toHaveBeenCalledTimes(0)
  })
})
