import path from 'node:path'

import type { Configure, Plugin } from '@zemble/core'

const pluginPaths = process.argv.slice(2)

if (pluginPaths.length === 0) {
  console.warn('No plugins specified, specify paths to them as arguments')
}

type Runner = (config: Configure) => void

export const cliRunner = async (runner: Runner) => {
  const plugins = await Promise.all(pluginPaths.map(async (p) => {
    const relativePath = path.isAbsolute(p)
      ? p
      : path.join(process.cwd(), p)

    const plugin = (await import(relativePath)).default as Promise<Plugin>
    return plugin
  }))

  return runner({ plugins })
}

export default cliRunner
