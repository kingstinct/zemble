import { Repeater } from 'graphql-yoga'

import type { LogOutput, QueryResolvers } from '../schema.generated'

// @ts-expect-error fix later
const loggerStreamer: QueryResolvers['logger'] = (_, __, { pubsub, logger }) => new Repeater<LogOutput>(async (push, stop) => {
  let hasStopped = false

  void stop.then(() => {
    hasStopped = true
  })

  const next = async () => {
    const res = await pubsub.subscribe(`logger`).next()
    const obj = res.value as { readonly severity: string, readonly args: readonly [unknown?, ...readonly unknown[]]}

    void push({
      severity: obj.severity,
      message: obj.args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a, null, ' ').replaceAll('\n', ' '))).join(', '),
      timestamp: new Date().toISOString(),
    })

    if (!hasStopped) {
      void next()
    }
  }

  void next()

  logger.info('logger streamer started')

  await stop
})

export default loggerStreamer
