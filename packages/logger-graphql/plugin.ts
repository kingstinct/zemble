import { useDeferStream } from '@graphql-yoga/plugin-defer-stream'
import { configure, getConsoleSink } from '@logtape/logtape'
import { Plugin } from '@zemble/core'
import YogaPlugin from '@zemble/graphql'

export interface GraphQLMiddlewareConfig extends Zemble.GlobalConfig {}

const defaultConfig = {} satisfies GraphQLMiddlewareConfig

export default new Plugin<GraphQLMiddlewareConfig>(import.meta.dir, {
  middleware: async () => {
    // Configure LogTape for the logger-graphql plugin
    await configure({
      sinks: {
        console: getConsoleSink(),
      },
      loggers: [
        {
          category: ['zemble', 'logger-graphql'],
          sinks: ['console'],
        },
      ],
    })
  },
  defaultConfig,
  dependencies: () => [
    {
      plugin: YogaPlugin.configure({
        yoga: {
          plugins: [useDeferStream()],
        },
      }),
    },
  ],
})
