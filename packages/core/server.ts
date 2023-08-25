import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import initializePlugin from './utils/initializePlugin'
import PluginConfig, { ConfiguredMiddleware } from './types'
import { readPackageJson } from './utils/readPackageJson'

const packageJson = readPackageJson();

const initializePlugins = async (plugins: PluginConfig<{}>[], app: Hono) => {
  await initializePlugin({ pluginPath: process.cwd(), app })

  await plugins.reduce(async (
    prev, 
    { pluginPath }
  ) => {
    await prev
    await initializePlugin({ pluginPath, app })
    return undefined
  }, Promise.resolve(undefined))
}


type Configure = {
  plugins: PluginConfig<any>[],
  middleware?: ConfiguredMiddleware[],
  inherits?: Configure[]
}

const getApp = async ({ plugins, middleware }: Omit<Configure, 'inherits'>) => {
  const context = {} as Readapt.Context

  const app = new Hono() as Readapt.Server

  app.use('*', cors())

  app.get('/', (c) => c.text('Hello ReAdapt! Serving ' + packageJson.name))

  await middleware?.reduce(async (
    prev, 
    middleware
  ) => {
    // console.log(`Initializing MIDDLWARE ${config.pluginName} with config:`, JSON.stringify(config.config, null, 2))
    await prev
    
    await middleware({ plugins, app, context })
    return undefined
  }, Promise.resolve(undefined))

  await initializePlugins(plugins, app)
  return app
}

const start = async ({ plugins, middleware }: Omit<Configure, 'inherits'>) => {
  const app = await getApp({ plugins, middleware })

  serve(app, (info) => console.log(info))

  return app
}

export const configure = (opts: Configure) => {
  const plugins = [
    ...opts.inherits?.flatMap(i => i.plugins) || [], 
    ...opts.plugins
  ]
  const middleware = [
    ...(opts.inherits?.flatMap(i => i.middleware ?? []) || []), 
    ...(opts.middleware ?? [])
  ]
  
  return {
    plugins,
    middleware,
    start: () => start({ plugins, middleware }),
    getApp: () => getApp({ plugins, middleware })
  }
}

export default configure