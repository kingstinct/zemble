import mergeDeep from './utils/mergeDeep'
import { readPackageJson } from './utils/readPackageJson'
import { defaultProviders } from './zembleContext'

import type { Middleware, PluginOpts } from './types'

export class Plugin<
  TConfig extends Zemble.GlobalConfig = Zemble.GlobalConfig,
  TDefaultConfig extends Partial<TConfig> = TConfig,
  TResolvedConfig extends TConfig & TDefaultConfig = TConfig & TDefaultConfig,
> {
  // eslint-disable-next-line functional/prefer-readonly-type
  #config: TResolvedConfig

  readonly additionalConfigWhenRunningLocally?: TConfig

  readonly dependencies: readonly Plugin<Zemble.GlobalConfig>[]

  readonly pluginPath: string

  readonly #middleware?: Middleware<TResolvedConfig, Plugin>

  // eslint-disable-next-line functional/prefer-readonly-type
  providers = defaultProviders as Zemble.Providers

  // eslint-disable-next-line functional/prefer-readonly-type
  #pluginName: string | undefined

  /**
   *
   * @param __dirname This should be the directory of the plugin (usually import.meta.dir), usually containing subdirectories like /routes and /graphql for automatic bootstrapping
   * @param opts
   */
  constructor(__dirname: string, opts?: PluginOpts<Plugin<TConfig, TDefaultConfig, TResolvedConfig>, TConfig, TDefaultConfig, TResolvedConfig>) {
    this.pluginPath = __dirname
    this.#config = (opts?.defaultConfig ?? {}) as TResolvedConfig
    this.additionalConfigWhenRunningLocally = opts?.additionalConfigWhenRunningLocally
    this.#pluginName = opts?.name ?? this.pluginName
    this.#pluginVersion = opts?.version ?? this.pluginVersion
    const deps = opts?.dependencies ?? []
    this.#middleware = opts?.middleware

    const allDeps = (typeof deps === 'function') ? deps(this) : deps

    const filteredDeps = allDeps.filter((d) => (this.isPluginRunLocally ? true : d.onlyWhenRunningLocally))

    const resolvedDeps = filteredDeps
      .map(({ plugin, config }) => plugin.configure(config))

    if (this.isPluginRunLocally) {
      this.configure(this.additionalConfigWhenRunningLocally)
    }

    this.dependencies = resolvedDeps
  }

  get isPluginRunLocally() {
    return (
      process.cwd() === this.pluginPath
    )
  }

  get initializeMiddleware() {
    return this.#middleware
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

  configure(config?: TConfig & Zemble.GlobalConfig) {
    if (config) {
      // eslint-disable-next-line functional/immutable-data
      this.#config = mergeDeep(
        this.#config as Record<string, unknown>, config as Record<string, unknown>,
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
