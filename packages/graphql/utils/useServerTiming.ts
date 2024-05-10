import {
  type Plugin as EnvelopPlugin,
} from '@envelop/core'
import { useOnResolve } from '@envelop/on-resolve'
import { endTime, startTime } from 'hono/timing'

import plugin from '../plugin'

export const useServerTiming = (): EnvelopPlugin<Pick<Zemble.GraphQLContext, 'honoContext'>> => ({
  onPluginInit: ({ addPlugin }) => {
    if (plugin.config.enableServerTiming) {
      const opCounts: Record<string, number> = {}
      addPlugin(
        useOnResolve<Pick<Zemble.GraphQLContext, 'honoContext'>>(({ info, context }) => {
          const c = context.honoContext

          const { fieldName } = info

          // eslint-disable-next-line functional/immutable-data
          opCounts[fieldName] = opCounts[fieldName] ? opCounts[fieldName]! + 1 : 1

          const uniqueName = `${fieldName}-${opCounts[fieldName]}`

          startTime(c, uniqueName, fieldName)

          return () => {
            endTime(c, uniqueName)
          }
        }),
      )
    }
  },
})
