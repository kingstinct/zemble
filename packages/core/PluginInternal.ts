import mergeDeep from './utils/mergeDeep'
import { readPackageJson } from './utils/readPackageJson'

import type { Dependency, PluginOpts } from './types'

export class Plugin<
  TConfig extends Zemble.GlobalConfig = Zemble.GlobalConfig,
  TDefaultConfig extends Partial<TConfig> = TConfig,
  TResolvedConfig extends TConfig & TDefaultConfig = TConfig & TDefaultConfig,
> {
  // eslint-disable-next-line functional/prefer-readonly-type
  #config: TResolvedConfig

  readonly devConfig?: TConfig

  readonly dependencies: readonly Plugin<Zemble.GlobalConfig>[]

  readonly pluginPath: string

  // eslint-disable-next-line functional/prefer-readonly-type
  providers = {} as Zemble.Providers

  // eslint-disable-next-line functional/prefer-readonly-type
  #pluginName: string | undefined

  /**
   *
   * @param __dirname This should be the directory of the plugin (usually import.meta.dir), usually containing subdirectories like /routes and /graphql for automatic bootstrapping
   * @param opts
   */
  constructor(__dirname: string, opts?: PluginOpts<TDefaultConfig, Plugin<TConfig, TConfig, TResolvedConfig>, TConfig>) {
    this.pluginPath = __dirname
    this.#config = (opts?.defaultConfig ?? {}) as TResolvedConfig
    this.devConfig = opts?.devConfig
    this.#pluginName = opts?.name ?? this.pluginName
    this.#pluginVersion = opts?.version ?? this.pluginVersion
    const deps = opts?.dependencies ?? []

    const allDeps = (typeof deps === 'function') ? deps(this) : deps

    const filteredDeps = allDeps.filter(this.#filterDevDependencies.bind(this))

    const resolvedDeps = filteredDeps
      .map(({ plugin, config }) => plugin.configure(config))

    if (this.#isPluginDevMode) {
      this.configure(this.devConfig)
    }

    this.dependencies = resolvedDeps
  }

  get #isPluginDevMode() {
    return (process.env.NODE_ENV === 'development' && process.cwd() === this.pluginPath)
  }

  #filterDevDependencies(dep: Dependency) {
    if (this.#isPluginDevMode) {
      return true
    }
    return !dep.devOnly
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
