import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import initializePlugin from './utils/initializePlugin'
import PluginConfig from './types'
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

const initialize = async (plugins: PluginConfig<any>[]) => {
  const app = new Hono()

  app.use('*', cors())

  app.get('/', (c) => c.text('Hello ReAdapt! Serving ' + packageJson.name))

  await plugins.reduce(async (
    prev, 
    { middleware, config }
  ) => {
    console.log(`Initializing MIDDLWARE ${config.pluginName} with config:`, JSON.stringify(config.config, null, 2))
    await prev
    await middleware?.(plugins, app, config)
    return undefined
  }, Promise.resolve(undefined))

  await initializePlugins(plugins, app)

  serve(app, (info) => console.log(info))
}

export default initialize