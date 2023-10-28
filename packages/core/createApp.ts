import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { readPackageJson } from './utils/readPackageJson'
import context from './zembleContext'

import type Plugin from './Plugin'
import type { PluginWithMiddleware } from './PluginWithMiddleware'
import type { RunBeforeServeFn } from './types'

const packageJson = readPackageJson()

export type Configure = {
  readonly plugins: readonly (Plugin | PluginWithMiddleware)[],
}

const logFilter = (log: string) => (log.includes('BEGIN PRIVATE KEY') || log.includes('BEGIN PUBLIC KEY') ? '<<KEY>>' : log)

export type ZembleApp = Zemble.App

const filterConfig = (config: Zemble.GlobalConfig) => Object.keys(config).reduce((prev, key) => {
  const value = config[key as keyof typeof config]
  return {
    ...prev,
    [key]: typeof value === 'string' ? logFilter(value) : value,
  }
}, {})

export const createApp = async ({ plugins: pluginsBeforeResolvingDeps }: Configure) => {
  const hono = new Hono<Zemble.HonoEnv>()

  // maybe this should be later - how about middleware that overrides logger?
  if (process.env.NODE_ENV !== 'test') {
    hono.use('*', logger(context.logger.log))
  }

  hono.use('*', async (ctx, next) => {
    // eslint-disable-next-line functional/immutable-data
    ctx.env = {
      ...ctx.env ?? {},
      ...{
        kv: context.kv.bind(context),
        logger: context.logger,
      },
    }
    await next()
  })

  hono.use('*', cors())

  const resolved = pluginsBeforeResolvingDeps.flatMap((plugin) => [...plugin.dependencies, plugin])

  const plugins = resolved.reduce((prev, plugin) => {
    const existingPlugin = prev.find(({ pluginName }) => pluginName === plugin.pluginName)
    if (existingPlugin) {
      if (existingPlugin !== plugin) {
        // in some situation we can end up with two instances of the same plugin (dependeing on package manager and
        // other factors). In those cases we use the latest version of the plugin, but try to merge the config
        const pluginToUse = existingPlugin.pluginVersion >= plugin.pluginVersion
          ? existingPlugin.configure(plugin.config)
          : plugin.configure(existingPlugin.config)

        context.logger.warn(`[@zemble] Found multiple instances of ${plugin.pluginName}, attempting to merge config, using version ${plugin.pluginVersion}`)

        return prev.map((p) => (p.pluginName !== pluginToUse.pluginName ? p : pluginToUse))
      }
      return prev
    }
    return [...prev, plugin]
  }, [] as readonly (Plugin | PluginWithMiddleware)[])

  const middleware = plugins.filter(
    (plugin): plugin is PluginWithMiddleware => 'initializeMiddleware' in plugin,
  )

  context.logger.log(`[@zemble] Initializing ${packageJson.name} with ${plugins.length} plugins:\n${plugins.map((p) => `- ${p.pluginName}@${p.pluginVersion}${'initializeMiddleware' in p ? ' (middleware)' : ''}`).join('\n')}`)

  if (process.env.DEBUG) {
    plugins.forEach((plugin) => {
      context.logger.log(`[@zemble] Loading ${plugin.pluginName} with config: ${JSON.stringify(filterConfig(plugin.config), null, 2)}`)
    })
  }

  const appDir = process.cwd()

  const preInitApp = {
    hono,
    appDir,
    providers: {} as Zemble.Providers,
  }

  const runBeforeServe = await middleware?.reduce(async (
    prev,
    middleware,
  ) => {
    const p = await prev

    const ret = await middleware.initializeMiddleware({
      plugins,
      app: preInitApp,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      context,
      config: middleware.config,
    })

    if (typeof ret === 'function') {
      return [...p, ret]
    }
    return p
  }, Promise.resolve([] as readonly RunBeforeServeFn[]))

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const zembleApp: Zemble.App = {
    ...preInitApp,
    hono,
    appDir,
    runBeforeServe,
  }

  hono.get('/', (c) => c.html(`<html>
    <head>
      <title>${packageJson.name}</title>
      <meta name="color-scheme" content="light dark">
    </head>
    <body>
      <div>
        <p>Hello Zemble! Serving ${packageJson.name}</p>
        <p><a href='/graphql'>Check out your GraphQL API here</a></p>
      </div>
    </body>
  </html>`))

  if (process.env.DEBUG) {
    const routes = hono.routes.map((route) => ` - [${route.method}] ${route.path}`).join('\n')
    console.log(`[@zemble] Routes:\n${routes}`)
  }

  return zembleApp
}

export default createApp
