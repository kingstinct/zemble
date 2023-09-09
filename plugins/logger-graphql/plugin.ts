import { useDeferStream } from '@graphql-yoga/plugin-defer-stream'
import { PluginWithMiddleware } from '@readapt/core'
import YogaPlugin from '@readapt/graphql-yoga'

export interface GraphQLMiddlewareConfig extends Readapt.GlobalConfig {

}

const defaultConfig = {

} satisfies GraphQLMiddlewareConfig

export default new PluginWithMiddleware<GraphQLMiddlewareConfig>(
  __dirname,
  // eslint-disable-next-line unicorn/consistent-function-scoping
  () => ({ context }) => {
    // eslint-disable-next-line functional/immutable-data
    context.logger = {
      time: (...args) => {
        context.pubsub.publish('logger', { severity: 'time', args })
        // eslint-disable-next-line no-console
        console.time(...args)
      },
      timeEnd: (...args) => {
        context.pubsub.publish('logger', { severity: 'timeEnd', args })
        // eslint-disable-next-line no-console
        console.timeEnd(...args)
      },
      debug: (...args) => {
        context.pubsub.publish('logger', { severity: 'debug', args })
        // eslint-disable-next-line no-console
        console.debug(...args)
      },
      error: (...args) => {
        context.pubsub.publish('logger', { severity: 'error', args })
        // eslint-disable-next-line no-console
        console.error(...args)
      },
      info: (...args) => {
        context.pubsub.publish('logger', { severity: 'info', args })
        // eslint-disable-next-line no-console
        console.info(...args)
      },
      log: (...args) => {
        context.pubsub.publish('logger', { severity: 'log', args })
        // eslint-disable-next-line no-console
        console.log(...args)
      },
      warn: (...args) => {
        context.pubsub.publish('logger', { severity: 'warn', args })
        // eslint-disable-next-line no-console
        console.warn(...args)
      },
    }
  },
  {
    defaultConfig,
    dependencies: [
      {
        plugin: YogaPlugin.configure({
          yoga: {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            plugins: [useDeferStream()],
          },
        }),
      },
    ],
  },
)
