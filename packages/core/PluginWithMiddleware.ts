import { configDotenv } from 'dotenv'

import Plugin from './Plugin'

import type { Middleware, PluginOpts } from './types'

// initialize dotenv before any plugins are loaded/configured
configDotenv()

export class PluginWithMiddleware<
  TConfig extends Readapt.GlobalConfig = Readapt.GlobalConfig,
  TDefaultConfig extends TConfig = TConfig,
  TResolvedConfig extends TConfig & TDefaultConfig = TConfig & TDefaultConfig,
> extends Plugin<TConfig, TDefaultConfig, TResolvedConfig> {
  // eslint-disable-next-line functional/prefer-readonly-type
  #middleware: Middleware<TResolvedConfig>

  constructor(__dirname: string, middleware: Middleware<TResolvedConfig>, opts?: PluginOpts<TDefaultConfig, Plugin<TConfig, TDefaultConfig, TResolvedConfig>>) {
    super(__dirname, opts)
    this.#middleware = middleware
  }

  get initializeMiddleware() {
    return this.#middleware(this.config)
  }
}

export default PluginWithMiddleware
