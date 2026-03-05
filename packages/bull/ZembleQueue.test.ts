import { describe, expect, it } from 'bun:test'

import ZembleQueue from './ZembleQueue'
import ZembleQueueMock from './ZembleQueueMock'

describe('ZembleQueue', () => {
  it('should use ZembleQueueMock in test environment', () => {
    expect(process.env.NODE_ENV).toBe('test')
    const queue = new ZembleQueue(() => {})
    expect(queue).toBeInstanceOf(ZembleQueueMock)
  })

  it('should be constructable with a worker function', () => {
    const worker = async () => 'result'
    const queue = new ZembleQueue(worker)
    expect(queue).toBeDefined()
  })

  it('should be constructable with config options', () => {
    const queue = new ZembleQueue(() => {}, {
      repeat: { pattern: '*/5 * * * *' },
    })
    expect(queue).toBeDefined()
  })
})
