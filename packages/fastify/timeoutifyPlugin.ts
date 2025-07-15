import { LOG_PREFIX, Timeoutify, TimeoutifyStatus } from '@zemble/timeoutify'
import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify'
import fastifyPlugin from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    timeoutify: Timeoutify
  }
}

export const timeoutifyPlugin = fastifyPlugin(
  (
    server: FastifyInstance,
    { timeoutMS }: FastifyPluginOptions & { readonly timeoutMS: number },
    next: Parameters<FastifyPluginCallback>['2'],
  ) => {
    server.addHook('onRequest', function timeoutifyRequest(req, reply, done) {
      const logPrefix = `${LOG_PREFIX} [${req.id}]`
      req.timeoutify = new Timeoutify({
        timeoutMS,
        logPrefix,
        logger: req.log,
      })

      req.socket.on('close', () => {
        if (!req.timeoutify.abortSignal.aborted) {
          req.timeoutify.abort()
        }
      })

      reply.raw.on('finish', () => {
        if (!req.timeoutify.abortSignal.aborted) {
          req.timeoutify.finished()
        }
      })

      req.timeoutify.abortSignal.addEventListener('abort', async () => {
        if (!reply.sent) {
          req.log.debug(`${logPrefix} no reply sent previously, sending error`)

          const isTimeout = req.timeoutify.status === TimeoutifyStatus.TimedOut

          const statusCode = isTimeout ? 504 : 499,
            errorText = `${logPrefix} ${isTimeout ? `Timed out after ${timeoutMS}ms` : 'Client closed request'}`

          req.log.warn(errorText)

          await reply
            .status(statusCode)
            .type('application/json')
            .send({
              data: null,
              errors: [errorText],
            })

          reply.send = () => reply
        }
      })

      done()
    })
    next()
  },
  {
    name: 'timeoutify',
  },
)
