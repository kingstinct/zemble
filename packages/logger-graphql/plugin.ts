import { useDeferStream } from '@graphql-yoga/plugin-defer-stream'
import { Plugin } from '@zemble/core'
import YogaPlugin from '@zemble/graphql'

export interface GraphQLMiddlewareConfig extends Zemble.GlobalConfig {

}

const defaultConfig = {

} satisfies GraphQLMiddlewareConfig

export default new Plugin<GraphQLMiddlewareConfig>(
  import.meta.dir,
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
