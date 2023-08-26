/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { configDotenv } from 'dotenv'

import configure from './server'
import { readPackageJson } from './utils/readPackageJson'

import type { Hono } from 'hono'

configDotenv()

declare global {
  namespace Readapt {
    interface Server extends Hono {

    }

    interface GlobalConfig extends Record<string, unknown> {

    }

    interface Context {

    }
  }
}

export type ConfiguredMiddleware = (
  opts: {
    readonly plugins: readonly PluginConfig<{}>[],
    readonly app: Readapt.Server,
    readonly context: Readapt.Context
  }
) => Promise<void> | void

export type Middleware<TMiddlewareConfig extends Record<string, unknown>> = (
  config?: TMiddlewareConfig
) => ConfiguredMiddleware

export class PluginConfig<
  TIn extends Record<string, unknown> & Readapt.GlobalConfig = Readapt.GlobalConfig,
  TDefault extends TIn = TIn,
  TOut extends TIn & TDefault = TIn & TDefault & Readapt.GlobalConfig
> {
  // eslint-disable-next-line functional/prefer-readonly-type
  config: TOut

  readonly #defaultConfig?: TDefault

  readonly pluginPath: string

  readonly pluginName: string

  constructor(__dirname: string, opts?: {readonly defaultConfig?: TDefault}) {
    this.pluginPath = __dirname
    this.config = (opts?.defaultConfig ?? {}) as TOut // TODO [>0.0.2]: might need some cleaning up
    this.#defaultConfig = opts?.defaultConfig
    this.pluginName = readPackageJson(__dirname).name

    if (process.env.PLUGIN_DEV) {
      void this.runPluginAsApp()
    }
  }

  configurePlugin(config?: TIn) {
    this.config = { ...this.#defaultConfig, ...config } as TOut
    console.debug(`Initializing plugin ${this.pluginName} with config:`, JSON.stringify(
      this.config,
      null,
      2,
    ))
    return this
  }

  async pluginAsApp() {
    const config = configure({
      plugins: [this.configurePlugin()],
    })

    return config.getApp()
  }

  async runPluginAsApp() {
    const config = configure({
      plugins: [this.configurePlugin()],
    })
    return config.start()
  }
}

export class PluginConfigWithMiddleware<
  TMiddlewareConfig extends Record<string, unknown> = {},
  TIn extends Record<string, unknown> & Readapt.GlobalConfig = {},
  TDefault extends TIn = TIn,
  TOut extends TIn & TDefault = TIn & TDefault & Readapt.GlobalConfig,
> extends PluginConfig<TIn, TDefault, TOut> {
  // eslint-disable-next-line functional/prefer-readonly-type
  #middleware: Middleware<TMiddlewareConfig>

  constructor(__dirname: string, middleware: Middleware<TMiddlewareConfig>, opts?: {readonly defaultConfig?: TDefault}) {
    super(__dirname, opts)
    this.#middleware = middleware
  }

  async pluginAsApp() {
    const config = configure({
      plugins: [this.configurePlugin()],
      middleware: [this.configureMiddleware()],
    })

    return config.getApp()
  }

  async runPluginAsApp() {
    const config = configure({
      plugins: [this.configurePlugin()],
      middleware: [this.configureMiddleware()],
    })
    return config.start()
  }

  // eslint-disable-next-line functional/prefer-tacit
  configureMiddleware(config?: TMiddlewareConfig) {
    console.debug(`Initializing middleware ${this.pluginName} with config:`, JSON.stringify(
      config,
      null,
      2,
    ))
    return this.#middleware(config)
  }
}

export default PluginConfig
