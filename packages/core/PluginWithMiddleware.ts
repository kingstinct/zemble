import { configDotenv } from 'dotenv'

import Plugin from './Plugin'

import type { Middleware, PluginOpts } from './types'

// initialize dotenv before any plugins are loaded/configured
configDotenv()

export class PluginWithMiddleware<
  TIn extends Record<string, unknown> & Readapt.GlobalConfig = Readapt.GlobalConfig,
  TDefault extends TIn = TIn,
  TOut extends TIn & TDefault = TIn & TDefault & Readapt.GlobalConfig,
> extends Plugin<TIn, TDefault, TOut> {
  // eslint-disable-next-line functional/prefer-readonly-type
  #middleware: Middleware<TOut>

  constructor(__dirname: string, middleware: Middleware<TOut>, opts?: PluginOpts<TDefault, Plugin<TIn, TDefault, TOut>>) {
    super(__dirname, opts)
    this.#middleware = middleware
  }

  get initializeMiddleware() {
    return this.#middleware(this.config)
  }
}

export default PluginWithMiddleware
