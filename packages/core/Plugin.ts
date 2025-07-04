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
  // eslint-disable-next-line functional/prefer-readonly-type
  #config: TResolvedConfig

  readonly additionalConfigWhenRunningLocally?: Partial<TConfig>

  readonly dependencies: readonly Plugin<Zemble.GlobalConfig>[]

  readonly pluginPath: string

  readonly #middleware?: Middleware<TResolvedConfig, Plugin>

  // eslint-disable-next-line functional/prefer-readonly-type
  multiProviders = defaultMultiProviders as unknown as Zemble.MultiProviders

  // eslint-disable-next-line functional/prefer-readonly-type
  #pluginName: string | undefined

  readonly debug: debug.Debugger

  // eslint-disable-next-line functional/prefer-readonly-type
  #providerStrategies: Zemble.ProviderStrategies = {}

  readonly #providers?: Partial<{
    // @ts-expect-error fix later
    readonly [key in keyof Zemble.Providers]: InitializeProvider<
      Zemble.Providers[key],
      unknown
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
    // eslint-disable-next-line functional/immutable-data
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

  // eslint-disable-next-line functional/prefer-readonly-type
  #pluginVersion: string | undefined

  #readPackageJson() {
    const pkgJson = readPackageJson(this.pluginPath)
    // eslint-disable-next-line functional/immutable-data
    this.#pluginVersion = pkgJson.version
    // eslint-disable-next-line functional/immutable-data
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
      // eslint-disable-next-line functional/immutable-data
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
