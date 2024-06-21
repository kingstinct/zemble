import { Plugin, setupProvider } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
import cronParser from 'cron-parser'
import fs from 'node:fs'
import path from 'node:path'

import readDir from './readDir'

import type { ZembleCron, ZembleJob } from '@zemble/core'

interface JobInMemory extends ZembleJob<unknown, unknown> {

}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['@zemble/crons']?: {}
    }

    interface MigrationContext {

    }
  }
}

// eslint-disable-next-line functional/prefer-readonly-type
let jobs: JobInMemory[] = []

export default new Plugin(
  import.meta.dir,
  {
    middleware: async ({
      app, self,
    }) => {
      await setupProvider({
        app,
        middlewareKey: '@zemble/crons',
        initializeProvider: (a) => {
          const provider = ({
            initialize: async () => {
              const allCronPaths = app.plugins.flatMap((p) => {
                const cronPath = path.join(p.pluginPath, '/crons')
                const hasCrons = fs.existsSync(cronPath)
                if (hasCrons) {
                  const cronsIn = readDir(cronPath)
                  return cronsIn.map((c) => path.join(cronPath, c))
                }
                return []
              })

              console.log(`found ${allCronPaths.length} cron paths`)

              await Promise.all(allCronPaths.map(async (p) => {
                console.log(`loading ${p}`)
                const cronJob = await (import(p) as Promise<{ readonly default: ZembleCron}>)

                console.log(cronJob)

                const interval = cronParser.parseExpression(cronJob.default.options.repeatPattern, {
                  tz: cronJob.default.options.timezone,
                  utc: !cronJob.default.options.timezone,
                })

                const scheduleNextJob = () => {
                  const createdAt = new Date()
                  const nextJobTime = interval.next().toDate()
                  console.log('scheduleNextJob', nextJobTime.toISOString())
                  setTimeout(() => {
                    const now = new Date()
                    void cronJob.default.worker({
                      createdAt,
                      data: {},
                      finishedRunningAt: undefined,
                      jobId: 'sdf',
                      runAtEarliest: nextJobTime,
                      startedRunningAt: now,
                      status: 'active',
                      error: undefined,
                      repeatableId: undefined,
                      returnValue: undefined,
                    })
                    scheduleNextJob()
                  }, nextJobTime.valueOf() - Date.now())
                }

                scheduleNextJob()
              }))
            },
            getById: (jobId: string) => jobs.find((j) => j.jobId === jobId),
            getAllJobs: () => jobs,
            obliterate: () => {
              const before = jobs.length
              jobs = []
              return before
            },
            removeByIds: (jobIds: readonly string[]) => {
              const before = jobs.length
              jobs = jobs.filter((j) => !jobIds.includes(j.jobId))
              const after = jobs.length
              return before - after
            },
          })

          void provider.initialize()

          return provider
        },
        providerKey: 'cronProvider',
      })
    },
    dependencies: [
      { plugin: GraphQL },
      { plugin: Routes },
    ],
  },
)
