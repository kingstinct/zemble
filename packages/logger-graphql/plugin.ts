import { useDeferStream } from '@graphql-yoga/plugin-defer-stream'
import { Plugin } from '@zemble/core'
import zembleContext from '@zemble/core/zembleContext'
import YogaPlugin from '@zemble/graphql'
import Logger from '@zemble/pino'
import pino from 'pino'

export interface GraphQLMiddlewareConfig extends Zemble.GlobalConfig {}

const defaultConfig = {} satisfies GraphQLMiddlewareConfig

export default new Plugin<GraphQLMiddlewareConfig>(import.meta.dir, {
  middleware: ({ context, app }) => {
    app.providers.pinoLogger.on('level-change', (level) => {
      context.pubsub.publish('logger', {
        severity: 'info',
        args: ['log level change', level],
      })
    })
  },
  defaultConfig,
  dependencies: () => [
    {
      plugin: Logger.configure({
        logger: {
          hooks: {
            logMethod(inputArgs, method, level) {
              const levelLabel = pino.levels.labels[level]
              // todo [>1]: fix so that zembleContext type is consistent
              const context = zembleContext as unknown as Zemble.GlobalContext
              context.pubsub.publish('logger', {
                severity: levelLabel,
                args: inputArgs,
              })
              method.apply(this, inputArgs)
            },
          },
        },
      }),
    },
    {
      plugin: YogaPlugin.configure({
        yoga: {
          plugins: [useDeferStream()],
        },
      }),
    },
  ],
})
