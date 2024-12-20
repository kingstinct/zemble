import { describe, test, expect } from 'bun:test'

import Timeoutify, { TimeoutifyStatus } from './Timeoutify'
import wait from '../wait'

describe('Timeoutify', () => {
  test('aborted after specified time', async () => {
    const timeoutify = new Timeoutify({ timeoutMS: 10 })

    await wait(30)
    expect(timeoutify.timeLeftMS).toEqual(0)
    expect(timeoutify.abortSignal.aborted).toBe(true)
  })

  test('should update timeout', async () => {
    const timeoutify = new Timeoutify({ timeoutMS: 10 })

    timeoutify.updateTimeout(100)

    await wait(30)
    expect(timeoutify.timeLeftMS).toBeGreaterThan(50)
    expect(timeoutify.timeLeftMS).toBeLessThanOrEqual(70)
    expect(timeoutify.status).toEqual(TimeoutifyStatus.Running)
    expect(timeoutify.abortSignal.aborted).toBe(false)
  })

  test('should update timeout and reset startedAt', async () => {
    const timeoutify = new Timeoutify({ timeoutMS: 10 })
    const { startedAt } = timeoutify

    await wait(10)

    timeoutify.updateTimeout(100, true)

    expect(timeoutify.startedAt).toBeGreaterThan(startedAt)
  })

  test('timeLeftMS', () => {
    const timeoutify = new Timeoutify({ timeoutMS: 10 })
    expect(timeoutify.timeLeftMS).toBeLessThanOrEqual(10)
    expect(timeoutify.timeLeftMS).toBeGreaterThanOrEqual(9)
    timeoutify.finished()
  })

  test('runMongoOpWithTimeout', () => {
    const timeoutify = new Timeoutify({ timeoutMS: 10 })
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(timeoutify.runMongoOpWithTimeout).toBeDefined()
    timeoutify.finished()
  })

  test('should mark as finished', () => {
    const timeoutify = new Timeoutify({ timeoutMS: 10 })

    expect(timeoutify.status).toBe(TimeoutifyStatus.Running)

    timeoutify.finished()

    expect(timeoutify.status).toBe(TimeoutifyStatus.Finished)
  })

  test('should mark as aborted', () => {
    const timeoutify = new Timeoutify({ timeoutMS: 10 })

    expect(timeoutify.status).toBe(TimeoutifyStatus.Running)

    timeoutify.abort()

    expect(timeoutify.abortSignal.aborted).toBe(true)
    expect(timeoutify.status).toBe(TimeoutifyStatus.Aborted)
  })
})
