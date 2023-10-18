/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */

import initializePlugin from './utils/initializePlugin'

import type { RoutesConfig } from './plugin'
import type { Middleware } from '@zemble/core/types'

const middleware: Middleware<RoutesConfig> = async ({ app, plugins }) => {
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

export default middleware
