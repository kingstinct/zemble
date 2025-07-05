import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { IStandardLogger } from '@zemble/core'
import { Plugin } from '@zemble/core'
import type { JsonValue } from 'type-fest'
import { MigrationLockError } from './MigrationLockError'

export type MigrationStatus<TProgress extends JsonValue = JsonValue> = {
  readonly name: string
  readonly startedAt: Date
  readonly completedAt?: Date
  readonly startedDownAt?: Date
  readonly progress?: TProgress
  readonly erroredAt?: Date
  readonly error?: string | null
}

export interface MigrationAdapter<TProgress extends JsonValue = JsonValue> {
  readonly status: () =>
    | Promise<readonly MigrationStatus<TProgress>[]>
    | readonly MigrationStatus<TProgress>[]
  readonly up: (
    name: string,
    runMigration: (context?: Zemble.MigrationContext) => Promise<void>,
  ) => Promise<void>
  readonly down: (
    name: string,
    runMigration: (context?: Zemble.MigrationContext) => Promise<void>,
  ) => Promise<void>
  readonly progress: (
    migrationStats: Pick<
      Required<MigrationStatus<TProgress>>,
      'progress' | 'name'
    >,
  ) => Promise<void>
}

export type Up<TProgress extends JsonValue = JsonValue> = (config: {
  readonly progress: TProgress | undefined
  readonly progressCallback: ((progress: TProgress) => void) | undefined
  readonly context: Zemble.MigrationContext
}) => Promise<void>
export type Down = (context: Zemble.MigrationContext) => Promise<void>

export type Migration = {
  readonly up: Up
  readonly down?: Down
}

interface MigrationConfig extends Zemble.DefaultMiddlewareConfig {
  readonly createAdapter: (config: {
    readonly providers: Zemble.Providers
  }) => Promise<MigrationAdapter> | MigrationAdapter
  readonly migrationsDir?: string
}

declare global {
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['@zemble/migrations']?: MigrationConfig
    }

    interface MigrationContext {}
  }
}

type MigrationToProcess<T extends JsonValue = JsonValue> = {
  readonly migrationName: string
  readonly fullPath: string
  readonly isMigrated: boolean
  readonly progress?: T
  readonly adapter: MigrationAdapter<T>
}

const getMigrations = async (
  migrationsDir: string,
  adapter: MigrationAdapter | undefined,
) => {
  const dirContents = await readdir(migrationsDir).catch(() => [])
  const filesRaw = dirContents.filter(
    (filename) => !filename.includes('.test.') && !filename.includes('.spec.'),
  )

  if (filesRaw.length === 0) {
    return []
  }

  if (!adapter) {
    throw new Error(
      `No migration adapter provided, expected one for migrations in ${migrationsDir}`,
    )
  }

  const statuses = await adapter.status()

  const migrations = filesRaw.map<MigrationToProcess>((filename) => {
    const filenameWithoutExtension = filename.split('.').slice(0, -1).join('.')

    const currentStatus = statuses.find(
      (status) => status.name === filenameWithoutExtension,
    )

    return {
      migrationName: filenameWithoutExtension,
      fullPath: join(migrationsDir, filename),
      isMigrated: !!currentStatus?.completedAt,
      progress: currentStatus?.progress,
      adapter,
    }
  })

  return migrations
}

let upMigrationsRemaining = [] as readonly MigrationToProcess[]
let downMigrationsRemaining = [] as readonly MigrationToProcess[]

export const migrateDown = async (opts?: {
  readonly migrateDownCount?: number
  readonly logger?: IStandardLogger
}) => {
  const { migrateDownCount = 1 } = opts ?? {}

  plugin.debug(
    'migrateDown: %d migrations to process',
    upMigrationsRemaining.length,
  )

  await downMigrationsRemaining.reduce(
    async (prev, { migrationName, fullPath, adapter }, index) => {
      await prev
      if (index >= migrateDownCount) {
        return
      }

      plugin.debug('Migrate down: %s', migrationName)
      const { down } = (await import(fullPath)) as Migration
      if (down) {
        await adapter?.down(migrationName, async (context) =>
          // @ts-ignore
          down(context ?? {}),
        )
      } else {
        plugin.debug(
          'Migration %s did not have a down function.',
          migrationName,
        )
      }
    },
    Promise.resolve(),
  )
}

export const migrateUp = async (opts?: {
  readonly logger?: IStandardLogger
  readonly migrateUpCount?: number
}) => {
  const { migrateUpCount = Infinity } = opts ?? {}

  plugin.debug(
    'migrateUp: %d migrations to process',
    upMigrationsRemaining.length,
  )

  const { count, cancelledBecauseOfLock } = await upMigrationsRemaining.reduce(
    async (prev, { migrationName, fullPath, progress, adapter }, index) => {
      const { count, cancelledBecauseOfLock } = await prev

      if (index >= migrateUpCount || cancelledBecauseOfLock) {
        return { count, cancelledBecauseOfLock }
      }

      plugin.debug('Migrate up: %s', migrationName)

      const { up } = (await import(fullPath)) as unknown as {
        readonly up: Up
        readonly down?: Down
      }
      if (up) {
        try {
          await adapter?.up(migrationName, async (context) =>
            up({
              // @ts-ignore
              context: context ?? {},
              progress,
              progressCallback: adapter.progress
                ? async (pgs) =>
                    adapter.progress?.({ name: migrationName, progress: pgs })
                : undefined,
            }),
          )
          return {
            count: count + 1,
            cancelledBecauseOfLock: false,
          }
        } catch (e) {
          if (e instanceof MigrationLockError) {
            plugin.debug(
              'Migration %s is already running, skipping..',
              migrationName,
            )
            return {
              count,
              cancelledBecauseOfLock: true,
            }
          }

          throw e
        }
      }

      throw new Error(`Migration ${migrationName} did not have an up function`)
    },
    Promise.resolve({ count: 0, cancelledBecauseOfLock: false }),
  )

  return { count, cancelledBecauseOfLock }
}

interface MigrationPluginConfig extends Zemble.GlobalConfig, MigrationConfig {
  readonly waitForMigrationsToComplete?: boolean
  readonly runMigrationsOnStart?: boolean
}

const defaultConfig = {
  runMigrationsOnStart: true,
  waitForMigrationsToComplete: true,
} satisfies Omit<MigrationPluginConfig, 'createAdapter'>

const plugin = new Plugin<MigrationPluginConfig, typeof defaultConfig>(
  import.meta.dir,
  {
    middleware: async ({ app, config, logger, self }) => {
      const migrationsPathOfApp = join(
        app.appDir,
        config.migrationsDir ?? 'migrations',
      )

      const appMigrations = await getMigrations(
        migrationsPathOfApp,
        await config?.createAdapter?.(app),
      )

      const pluginMigrations = await Promise.all(
        app.plugins.map(async (plugin) => {
          const migrationConfig = config.middleware?.['@zemble/migrations'] as
            | MigrationConfig
            | undefined

          const pluginMigrationsPath = join(
            self.pluginPath,
            migrationConfig?.migrationsDir ?? 'migrations',
          )
          return getMigrations(
            pluginMigrationsPath,
            await migrationConfig?.createAdapter?.(plugin),
          )
        }),
      )

      const allMigrations = appMigrations.concat(...pluginMigrations.flat())

      upMigrationsRemaining = allMigrations
        .filter((migration) => !migration.isMigrated)
        .sort((a, b) => a.migrationName.localeCompare(b.migrationName))
      downMigrationsRemaining = allMigrations
        .filter((migration) => migration.isMigrated)
        .sort((a, b) => b.migrationName.localeCompare(a.migrationName))

      return async () => {
        if (config.runMigrationsOnStart) {
          const completer = migrateUp({ logger })

          if (config.waitForMigrationsToComplete) {
            const { cancelledBecauseOfLock } = await completer
            if (cancelledBecauseOfLock) {
              const hasMigrationsCompleted = async () => {
                const migrations = await getMigrations(
                  migrationsPathOfApp,
                  await config?.createAdapter?.(app),
                )
                const migrationsToProcess = migrations.filter(
                  (migration) => !migration.isMigrated,
                )
                if (migrationsToProcess.length === 0) {
                  return true
                }
                logger.info(
                  { migrationsToProcess },
                  `Waiting for ${migrationsToProcess.length} migrations to complete...`,
                )
                return false
              }

              const waitForMigrationsToComplete = async () => {
                const hasCompleted = await hasMigrationsCompleted()
                if (!hasCompleted) {
                  await new Promise((resolve) => {
                    setTimeout(resolve, 1000)
                  })
                  return waitForMigrationsToComplete()
                }
                return undefined
              }

              return waitForMigrationsToComplete()
            }
          }
        }

        return undefined
      }
    },
    dependencies: [],
    defaultConfig,
  },
)

export default plugin
