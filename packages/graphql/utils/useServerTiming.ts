import { type Plugin as EnvelopPlugin } from '@envelop/core'
import { useOnResolve } from '@envelop/on-resolve'
import { endTime, startTime } from 'hono/timing'

import plugin from '../plugin'

export const useServerTiming = (): EnvelopPlugin<
  Pick<Zemble.GraphQLContext, 'honoContext'>
> => ({
  onPluginInit: ({ addPlugin }) => {
    if (plugin.config.enableServerTiming) {
      const opCounts: Record<string, number> = {}
      addPlugin(
        useOnResolve<Pick<Zemble.GraphQLContext, 'honoContext'>>(
          ({ info, context }) => {
            const c = context.honoContext

            const { fieldName } = info

            opCounts[fieldName] = opCounts[fieldName]
              ? opCounts[fieldName]! + 1
              : 1

            if (opCounts[fieldName] > 2) {
              return () => {}
            }

            const more = opCounts[fieldName] > 1 ? '++' : ''

            const uniqueName = `${fieldName}-${opCounts[fieldName]}${more}`

            startTime(c, uniqueName, fieldName + more)

            return () => {
              endTime(c, uniqueName)
            }
          },
        ),
      )
    }
  },
})
