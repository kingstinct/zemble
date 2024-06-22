import { Plugin, type Cron } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import { parseCronExpression } from 'cron-schedule'
import { IntervalBasedCronScheduler } from 'cron-schedule/schedulers/interval-based.js'

interface Config extends Zemble.GlobalConfig {
  readonly crons: ReadonlyArray<Cron>
}

const plugin = new Plugin<Config>(
  import.meta.dir,
  {
    dependencies: [{ plugin: GraphQL }],
    middleware: ({ config, self }) => {
      const scheduler = new IntervalBasedCronScheduler(1000)
      config.crons.forEach((cronConfig) => {
        const { recurrencePattern, errorHandler, worker } = cronConfig
        const cron = parseCronExpression(recurrencePattern)
        scheduler.registerTask(cron, worker, {
          isOneTimeTask: false,
          errorHandler: (error) => {
            if (errorHandler) {
              errorHandler(error)
            } else {
              self.providers.logger.error(error)
            }
          },
        })
      })
    },
  },
)

plugin.configure({
  crons: [
    {
      recurrencePattern: '*/5 * * * * *',
      worker: async () => {
        console.log('Hello from in-memory cron')
      },
    },
    {
      recurrencePattern: '*/5 * * * * *',
      worker: async () => {
        throw new Error('Error from in-memory cron')
      },
    },
  ],
})

export default plugin
