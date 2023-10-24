import { PluginWithMiddleware } from '@zemble/core'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

import type { JsonValue } from 'type-fest'

export type MigrationStatus<TProgress extends JsonValue = JsonValue> = {
  readonly name: string
  readonly completedAt: Date
  readonly progress?: TProgress
}

export interface MigrationAdapter<TProgress extends JsonValue = JsonValue> {
  readonly status: () => Promise<readonly MigrationStatus<TProgress>[]> | readonly MigrationStatus<TProgress>[]
  readonly up: (migrationStatus: MigrationStatus<TProgress>) => Promise<void>
  readonly down: (name: string) => Promise<void>
  readonly progress: (migrationStats: NonNullable<Omit<MigrationStatus, 'completedAt'>>) => Promise<void>
}

export type Up<TProgress extends JsonValue = JsonValue> = (progress: TProgress | undefined, progressCallback: ((progress: TProgress) => void) | undefined) => Promise<void>
export type Down = () => Promise<void>

export type Migration = {
  readonly up: Up
  readonly down?: Down
}

interface MigrationConfig {
  readonly adapter: MigrationAdapter
  readonly migrationsDir?: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['@zemble/migrations']?: MigrationConfig
    }
  }
}

type MigrationToProcess<T extends JsonValue = JsonValue> = {
  readonly migrationName: string,
  readonly fullPath: string,
  readonly isMigrated: boolean,
  readonly progress?: T,
  readonly adapter: MigrationAdapter<T>,
}

const getMigrations = async (migrationsDir: string, adapter: MigrationAdapter | undefined) => {
  const dirContents = await readdir(migrationsDir).catch(() => [])
  const filesRaw = dirContents.filter((filename) => !filename.includes('.test.') && !filename.includes('.spec.'))

  if (filesRaw.length === 0) {
    return []
  }

  if (!adapter) {
    throw new Error(`No migration adapter provided, expected one for migrations in ${migrationsDir}`)
  }

  const statuses = await adapter.status()

  const migrations = filesRaw.map<MigrationToProcess>((filename) => {
    const filenameWithoutExtension = filename.split('.').slice(0, -1).join('.')

    const currentStatus = statuses.find((status) => status.name === filenameWithoutExtension)

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

export const migrateDown = async (migrateDownCount = 1) => {
  console.log(`[@zemble/migrations] migrateDown: ${upMigrationsRemaining.length} migrations to process`)
  await downMigrationsRemaining.reduce(async (prev, {
    migrationName, fullPath, adapter,
  }, index) => {
    await prev
    if (index >= migrateDownCount) {
      return
    }

    console.log(`[@zemble/migrations] Migrate down: ${migrationName}`)
    const { down } = await import(fullPath) as Migration
    if (down) {
      await down()
    } else {
      console.warn(`[@zemble/migrations] Migration ${migrationName} did not have a down function.`)
    }
    await adapter?.down(migrationName)
  }, Promise.resolve())
}

export const migrateUp = async (migrateUpCount = Infinity) => {
  console.log(`[@zemble/migrations] migrateUp: ${upMigrationsRemaining.length} migrations to process`)
  await upMigrationsRemaining.reduce(async (prev, {
    migrationName, fullPath, progress, adapter,
  }, index) => {
    await prev

    if (index >= migrateUpCount) {
      return
    }

    console.log(`[@zemble/migrations] Migrate up: ${migrationName}`)
    const { up } = await import(fullPath) as unknown as { readonly up: Up, readonly down?: Down }
    if (up) {
      await up(
        progress,
        adapter.progress ? async (pgs) => adapter.progress?.({ name: migrationName, progress: pgs }) : undefined,
      )
      await adapter?.up({ name: migrationName, completedAt: new Date() })
    }
  }, Promise.resolve())
}

interface MigrationPluginConfig extends Zemble.GlobalConfig, MigrationConfig {
  readonly waitForMigrationsToComplete?: boolean
  readonly runMigrationsOnStart?: boolean
}

const defaultConfig = {
  runMigrationsOnStart: true,
  waitForMigrationsToComplete: true,
} satisfies Omit<MigrationPluginConfig, 'adapter'>

export default new PluginWithMiddleware<MigrationPluginConfig, typeof defaultConfig>(
  __dirname,
  (async ({
    plugins, app, config,
  }) => {
    const migrationsPathOfApp = join(app.appDir, config.migrationsDir ?? 'migrations')

    const appMigrations = await getMigrations(migrationsPathOfApp, config.adapter)

    const pluginMigrations = await Promise.all(plugins.map(async (plugin) => {
      const migrationConfig = plugin.config.middleware?.['@zemble/migrations'] as MigrationConfig | undefined

      const pluginMigrationsPath = join(plugin.pluginPath, migrationConfig?.migrationsDir ?? 'migrations')
      return getMigrations(pluginMigrationsPath, migrationConfig?.adapter)
    }))

    const allMigrations = appMigrations.concat(...pluginMigrations.flat())

    upMigrationsRemaining = allMigrations.filter((migration) => !migration.isMigrated).sort((a, b) => a.migrationName.localeCompare(b.migrationName))
    downMigrationsRemaining = allMigrations.filter((migration) => migration.isMigrated).sort((a, b) => b.migrationName.localeCompare(a.migrationName))

    return async () => {
      if (config.runMigrationsOnStart) {
        const completer = migrateUp()

        if (config.waitForMigrationsToComplete) {
          await completer
        }
      }
    }
  }),
  {
    dependencies: [],
    defaultConfig,
  },
)
