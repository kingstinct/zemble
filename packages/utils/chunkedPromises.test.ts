// test for chunkedPromises
import { describe, expect, it } from 'bun:test'

import { chunkedPromises } from './chunkedPromises'

describe('chunkedPromises', () => {
  it('should work', async () => {
    const data = Array.from({ length: 100 }, (_, i) => i)
    const result = await chunkedPromises(data, (i) => i * 2)
    expect(result).toEqual(
      data.map((i) => ({ value: i * 2, status: 'fulfilled' })),
    )
  })

  it('should hamdle errors', async () => {
    const data = Array.from({ length: 100 }, (_, i) => i)

    const result = await chunkedPromises(data, async (i) => {
      if (i === 50) {
        return Promise.reject(new Error('test'))
      }
      return i * 2
    })

    expect(result).toEqual(
      data.map((i) => {
        if (i === 50) {
          return { reason: new Error('test'), status: 'rejected' }
        }
        return { value: i * 2, status: 'fulfilled' }
      }),
    )
  })

  it('should handle maxThroughputPerSecond', async () => {
    const data = Array.from({ length: 110 }, (_, i) => i)
    const startTime = Date.now()

    await chunkedPromises(data, (i) => i * 2, 10, 10)

    const finishedAtTime = Date.now()

    const duration = finishedAtTime - startTime
    expect(duration).toBeGreaterThanOrEqual(1000)
  })
})
