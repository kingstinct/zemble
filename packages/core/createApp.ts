import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import KeyValue from './clients/KeyValue'
import initializePlugin from './utils/initializePlugin'
import { readPackageJson } from './utils/readPackageJson'
import { uniqBy } from './utils/uniqBy'

import type { IStandardKeyValueService } from '.'
import type Plugin from './Plugin'
import type { PluginWithMiddleware } from './PluginWithMiddleware'

const packageJson = readPackageJson()

const initializePlugins = async (plugins: readonly Plugin[], app: Hono) => {
  await plugins.reduce(async (
    prev,
    { pluginPath },
  ) => {
    await prev
    await initializePlugin({ pluginPath, app })
    return undefined
  }, Promise.resolve(undefined))

  await initializePlugin({ pluginPath: process.cwd(), app })
}

type Configure = {
  readonly plugins: readonly (Plugin | PluginWithMiddleware)[],
}

export type ReadaptApp = {
  readonly app: Readapt.Server
  readonly start: () => Readapt.Server
}

const logFilter = (log: string) => (log.includes('BEGIN PRIVATE KEY') || log.includes('BEGIN PUBLIC KEY') ? '<<KEY>>' : log)

const filterConfig = (config: Record<string, unknown>) => Object.keys(config).reduce((prev, key) => {
  const value = config[key as keyof typeof config]
  return {
    ...prev,
    [key]: typeof value === 'string' ? logFilter(value) : value,
  }
}, {})

export const createApp = async ({ plugins: pluginsBeforeResolvingDeps }: Configure): Promise<ReadaptApp> => {
  const context = {
    logger: console,
    kv<T extends Readapt.KVPrefixes[K], K extends keyof Readapt.KVPrefixes = keyof Readapt.KVPrefixes>(prefix: K): IStandardKeyValueService<T> {
      // @ts-expect-error fix sometime maybe :)
      return new KeyValue<T>(prefix) as unknown as IStandardKeyValueService<T>
    },
  } as unknown as Readapt.GlobalContext

  const app = new Hono() as Readapt.Server

  // maybe this should be later - how about middleware that overrides logger?
  if (process.env.NODE_ENV !== 'test') {
    app.use('*', logger(context.logger.log))
  }

  app.use('*', cors())

  const resolved = await Promise.all(
    pluginsBeforeResolvingDeps.flatMap(async (plugin) => [...await plugin.dependencies, plugin]),
  ).then((plugins) => plugins.flat())

  const plugins = uniqBy(resolved, 'pluginName')

  const middleware = plugins.filter(
    (plugin): plugin is PluginWithMiddleware => 'initializeMiddleware' in plugin,
  )

  console.log(`Initializing ${packageJson.name} with ${plugins.length} plugins whereof ${middleware.length} contains middleware`)

  plugins.forEach((plugin) => {
    console.log(`Loading ${plugin.pluginName} with config: ${JSON.stringify(filterConfig(plugin.config), null, 2)}`)
  })

  await middleware?.reduce(async (
    prev,
    middleware,
  ) => {
    await prev

    await middleware.initializeMiddleware({ plugins, app, context })
    return undefined
  }, Promise.resolve(undefined))

  await initializePlugins(plugins, app)

  app.get('/', (c) => c.html(`<html>
    <head>
      <title>${packageJson.name}</title>
      <meta name="color-scheme" content="light dark">
    </head>
    <body>
      <div>
        <p>Hello ReAdapt! Serving ${packageJson.name}</p>
        <p><a href='/graphql'>Check out your GraphQL API here</a></p>
      </div>
    </body>
  </html>`))

  return {
    app,
    start: () => {
      serve(app, (info) => console.log(info))
      return app
    },
  }
}

export default createApp
