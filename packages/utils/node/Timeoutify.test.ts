import Timeoutify, { TimeoutifyStatus } from './Timeoutify'
import wait from '../wait'

describe('Timeoutify', () => {
  test('aborted after specified time', async () => {
    const timeoutify = new Timeoutify({ timeoutMS: 10 })

    await wait(30)
    expect(timeoutify.timeLeftMS).toEqual(0)
    expect(timeoutify.abortSignal.aborted).toBe(true)
  })

  test('timeLeftMS', () => {
    const timeoutify = new Timeoutify({ timeoutMS: 10 })
    expect(timeoutify.timeLeftMS).toBe(10)
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
