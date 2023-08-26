/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { configDotenv } from 'dotenv'

import configure from './server'
import { readPackageJson } from './utils/readPackageJson'

import type { Context as HonoContext, Hono } from 'hono'

configDotenv()

declare global {
  namespace Readapt {
    interface Server extends Hono {

    }

    interface GlobalConfig extends Record<string, unknown> {

    }

    interface Context extends HonoContext {

    }

    interface TokenContents extends Record<string, unknown> {

    }

    interface DecodedToken extends TokenContents {
      readonly iat: number
      readonly iss: string
    }
  }
}

type PluginDependency = {
  readonly plugin: PluginConfig<{}>,
  readonly devOnly?: boolean, // decides if we should warn if this plugin is not used in production
}

type MiddlewareDependency = {
  readonly middleware: ConfiguredMiddleware,
  readonly devOnly?: boolean, // decides if we should warn if this middleware is not used in production, maybe to develop a plugin we need authentication
}

type PluginOpts<TDefault extends Record<string, unknown>> = {
  readonly defaultConfig?: TDefault,
  readonly middlewareDependencies?: readonly MiddlewareDependency[],
  readonly pluginDependencies?: readonly PluginDependency[],
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

  readonly #middlewareDependencies?: readonly MiddlewareDependency[]

  readonly #pluginDependencies?: readonly PluginDependency[]

  readonly pluginPath: string

  readonly pluginName: string

  constructor(__dirname: string, opts?: PluginOpts<TDefault>) {
    this.pluginPath = __dirname
    this.config = (opts?.defaultConfig ?? {}) as TOut // TODO [>0.0.2]: might need some cleaning up
    this.#defaultConfig = opts?.defaultConfig
    this.pluginName = readPackageJson(__dirname).name
    this.#middlewareDependencies = opts?.middlewareDependencies
    this.#pluginDependencies = opts?.pluginDependencies

    if (process.env.PLUGIN_DEV && process.cwd() === __dirname) {
      void this.runDevApp()
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

  get pluginDependenciesDev() {
    return this.#pluginDependencies?.map(({ plugin }) => plugin) ?? []
  }

  get middlewareDependenciesDev() {
    return this.#middlewareDependencies?.map(({ middleware }) => middleware) ?? []
  }

  get devConfig() {
    const config = configure({
      plugins: [...this.pluginDependenciesDev, this.configurePlugin()],
      middleware: this.middlewareDependenciesDev,
    })
    return config
  }

  async devApp() {
    return this.devConfig.getApp()
  }

  async runDevApp() {
    return this.devConfig.start()
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

  constructor(__dirname: string, middleware: Middleware<TMiddlewareConfig>, opts?: PluginOpts<TDefault>) {
    super(__dirname, opts)
    this.#middleware = middleware
  }

  get devConfig() {
    const config = configure({
      plugins: [...this.pluginDependenciesDev, this.configurePlugin()],
      middleware: [...this.middlewareDependenciesDev, this.configureMiddleware()],
    })
    return config
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
