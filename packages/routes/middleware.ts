/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */

import initializePlugin from './utils/initializePlugin'

import type { RoutesConfig } from './plugin'
import type { Plugin } from '@zemble/core'
import type { Middleware } from '@zemble/core/types'
import type { Hono } from 'hono'

const initializePlugins = async (plugins: readonly Plugin[], app: Hono) => {
  await plugins.reduce(async (
    prev,
    { pluginPath, config },
  ) => {
    await prev
    if (!config.middleware?.['@zemble/routes']?.disable) {
      await initializePlugin({
        pluginPath,
        app,
        config: config.middleware?.['@zemble/routes'] ?? {},
      })
    }

    return undefined
  }, Promise.resolve(undefined))

  await initializePlugin({ pluginPath: process.cwd(), app, config: {} })
}

const setupMiddleware = async (
  { app, plugins },
) => {
  await initializePlugins(plugins, app)
}

export const middleware: Middleware<RoutesConfig> = () => setupMiddleware

export default middleware
