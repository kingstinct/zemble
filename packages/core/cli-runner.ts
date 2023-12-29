import path from 'node:path'

import zembleContext from './zembleContext'

import type { Configure, Plugin, ZembleApp } from '@zemble/core'

const pluginPaths = process.argv.slice(2)

if (pluginPaths[0] === '--help' || pluginPaths[0] === '-h' || pluginPaths[0] === 'help') {
  zembleContext.logger.info('Usage: zemble-dev <pathToPluginOrApp> [morePlugins..]')
  process.exit(0)
}

if (pluginPaths.length === 0) {
  zembleContext.logger.warn('No plugins specified so this is just an empty app, see `zemble-dev --help` for usage')
}

type Runner = (config: Configure | ZembleApp) => void

export const cliRunner = async (runner: Runner) => {
  let app: ZembleApp | undefined
  const files = await Promise.all(pluginPaths.map(async (p) => {
    const relativePath = path.isAbsolute(p)
      ? p
      : path.join(process.cwd(), p)

    const plugin = (await (await import(relativePath)).default) as Plugin | ZembleApp

    if ('hono' in plugin) {
      app = plugin
    }

    return plugin
  }))

  // if there's an app, quit early
  if (app) {
    return runner(app)
  }

  return runner({ plugins: files.filter((f): f is Plugin => 'pluginName' in f) })
}

export default cliRunner
