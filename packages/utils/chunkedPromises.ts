import { chunk } from 'lodash/fp'

export async function chunkedPromises<T = unknown, TRes = unknown>(
  data: readonly T[],
  processor: (element: T) => Promise<TRes> | TRes,
  chunkSize = 50,
  maxChunksPerSecond = 100,
) {
  const chunks = chunk(chunkSize, data),
        minTimeBetweenChunks = 1000 / maxChunksPerSecond

  const init = Promise.resolve({
    acc: [] as readonly PromiseSettledResult<TRes>[],
    startedAt: Date.now() - minTimeBetweenChunks, // do not throttle the first chunk
  })

  const result = await chunks.reduce(async (prev, c) => {
    const { acc, startedAt: previousStartedAt } = await prev

    const earliestTimeToStart = previousStartedAt + minTimeBetweenChunks
    const timeUntilStart = earliestTimeToStart - Date.now()

    if (timeUntilStart > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, timeUntilStart)
      })
    }

    const startedAt = Date.now()
    const res = await Promise.allSettled(c.map(processor))
    return { acc: [...acc, ...res], startedAt }
  }, init)

  return result.acc
}

export default chunkedPromises
