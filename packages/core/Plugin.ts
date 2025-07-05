import mergeDeep from '@zemble/utils/mergeDeep'
import debug from 'debug'

import { createProviderProxy } from './createProvidersProxy'
import type { Middleware, PluginOpts } from './types'
import { readPackageJson } from './utils/readPackageJson'
import setupProvider, { type InitializeProvider } from './utils/setupProvider'
import { defaultMultiProviders } from './zembleContext'

export class Plugin<
  TConfig extends Zemble.GlobalConfig = Zemble.GlobalConfig,
  TDefaultConfig extends Partial<TConfig> = TConfig,
  TResolvedConfig extends TConfig & TDefaultConfig = TConfig & TDefaultConfig,
> {
  #config: TResolvedConfig

  readonly additionalConfigWhenRunningLocally?: Partial<TConfig>

  readonly dependencies: readonly Plugin<Zemble.GlobalConfig>[]

  readonly pluginPath: string

  readonly #middleware?: Middleware<TResolvedConfig, Plugin>

  multiProviders = defaultMultiProviders as unknown as Zemble.MultiProviders

  #pluginName: string | undefined

  readonly debug: debug.Debugger

  #providerStrategies: Zemble.ProviderStrategies = {}

  readonly #providers?: Zemble.Providers extends Record<string, never>
    ? undefined
    : Partial<{
        readonly [key in keyof Zemble.Providers]: InitializeProvider<
          Zemble.Providers[key],
          keyof Zemble.MiddlewareConfig extends never
            ? never
            : keyof Zemble.MiddlewareConfig
        >
      }>

  /**
   *
   * @param __dirname This should be the directory of the plugin (usually import.meta.dir), usually containing subdirectories like /routes and /graphql for automatic bootstrapping
   * @param opts
   */
  constructor(
    __dirname: string,
    opts?: PluginOpts<
      Plugin<TConfig, TDefaultConfig, TResolvedConfig>,
      TConfig,
      TDefaultConfig,
      TResolvedConfig
    >,
  ) {
    this.pluginPath = __dirname
    this.#config = (opts?.defaultConfig ?? {}) as TResolvedConfig
    this.additionalConfigWhenRunningLocally =
      opts?.additionalConfigWhenRunningLocally
    this.#pluginName = opts?.name ?? this.pluginName
    this.#pluginVersion = opts?.version ?? this.pluginVersion
    const deps = opts?.dependencies ?? []
    this.#middleware = opts?.middleware
    this.debug = debug(this.#pluginName)
    this.#providers = opts?.providers

    const allDeps = typeof deps === 'function' ? deps(this) : deps

    const filteredDeps = allDeps.filter((d) =>
      this.isPluginRunLocally ? true : d.onlyWhenRunningLocally,
    )

    const resolvedDeps = filteredDeps.map(({ plugin, config }) =>
      plugin.configure(config as Partial<unknown>),
    )

    if (this.isPluginRunLocally) {
      this.configure(this.additionalConfigWhenRunningLocally)
    }

    this.dependencies = resolvedDeps
  }

  setProviderStrategies(providerStrategies: Zemble.ProviderStrategies) {
    this.#providerStrategies = providerStrategies
  }

  get providers() {
    return createProviderProxy(this.multiProviders, this.#providerStrategies)
  }

  get isPluginRunLocally() {
    return process.cwd() === this.pluginPath
  }

  async initializeMiddleware(
    ...args: Parameters<Middleware<TResolvedConfig, Plugin>>
  ) {
    const providers = this.#providers
    if (providers) {
      Object.keys(providers).forEach((key) => {
        const providerKey = key as keyof Zemble.Providers
        const initializeProvider = providers[providerKey]
        void setupProvider({
          app: args[0].app,
          initializeProvider: initializeProvider as never,
          middlewareKey: this.pluginName as never,
          providerKey,
          alwaysCreateForEveryPlugin: false,
        })
      })
    }

    return this.#middleware?.(...args)
  }

  #pluginVersion: string | undefined

  #readPackageJson() {
    const pkgJson = readPackageJson(this.pluginPath)
    this.#pluginVersion = pkgJson.version
    this.#pluginName = pkgJson.name

    return pkgJson
  }

  get pluginVersion(): string {
    if (!this.#pluginVersion) {
      return this.#readPackageJson().version
    }

    return this.#pluginVersion
  }

  get pluginName(): string {
    if (!this.#pluginName) {
      return this.#readPackageJson().name
    }

    return this.#pluginName
  }

  configure(config?: Partial<TConfig & Zemble.GlobalConfig>) {
    if (config) {
      this.#config = mergeDeep(
        this.#config as Record<string, unknown>,
        config as Record<string, unknown>,
      ) as TResolvedConfig
    }

    return this
  }

  /**
   * Warning: don't export this directly from your plugin file, it will snapshot the config at that point in time
   */
  get config() {
    return this.#config
  }
}

export default Plugin
