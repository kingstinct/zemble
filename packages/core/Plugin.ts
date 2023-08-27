import { configDotenv } from 'dotenv'

import { createApp } from './createApp'
import mergeDeep from './utils/mergeDeep'
import { readPackageJson } from './utils/readPackageJson'

import type { ReadaptApp } from './createApp'
import type PluginWithMiddleware from './PluginWithMiddleware'
import type { DependenciesResolver, Dependency, PluginOpts } from './types'

// initialize dotenv before any plugins are loaded/configured
configDotenv()

export class Plugin<
  TConfig extends Readapt.GlobalConfig = Readapt.GlobalConfig,
  TDefaultConfig extends TConfig = TConfig,
  TResolvedConfig extends TConfig & TDefaultConfig = TConfig & TDefaultConfig,
> {
  // eslint-disable-next-line functional/prefer-readonly-type
  #config: TResolvedConfig

  readonly #dependencies: DependenciesResolver<Plugin<Readapt.GlobalConfig>>

  readonly pluginPath: string

  // eslint-disable-next-line functional/prefer-readonly-type
  #pluginName: string | undefined

  constructor(__dirname: string, opts?: PluginOpts<TDefaultConfig, Plugin<TConfig, TConfig, TResolvedConfig>>) {
    this.pluginPath = __dirname
    this.#config = (opts?.defaultConfig ?? {}) as TResolvedConfig
    this.#dependencies = opts?.dependencies as DependenciesResolver<Plugin<Readapt.GlobalConfig>> || []

    if (this.#isPluginDevMode) {
      void this.#createApp().then((app) => app.start())
    }
  }

  get #isPluginDevMode() {
    return process.env.PLUGIN_DEV && process.cwd() === this.pluginPath
  }

  #filterDevDependencies(dep: Dependency) {
    if (this.#isPluginDevMode) {
      return true
    }
    return !dep.devOnly
  }

  get pluginName(): string {
    if (!this.#pluginName) {
      // eslint-disable-next-line functional/immutable-data
      this.#pluginName = readPackageJson(this.pluginPath).name
    }

    return this.#pluginName!
  }

  configure(config?: TConfig & Readapt.GlobalConfig) {
    // eslint-disable-next-line functional/immutable-data
    this.#config = mergeDeep(this.#config as Record<string, unknown>, (config ?? {}) as Record<string, unknown>) as TResolvedConfig
    return this
  }

  get config() {
    return this.#config
  }

  get dependencies() {
    const allDeps = (typeof this.#dependencies === 'function') ? this.#dependencies(this) : this.#dependencies

    return allDeps.filter(this.#filterDevDependencies.bind(this)).map((dep) => dep.plugin)
  }

  async #createApp(): Promise<ReadaptApp> {
    return createApp({
      plugins: [...this.dependencies, this] as readonly (Plugin<Readapt.GlobalConfig> | PluginWithMiddleware<Readapt.GlobalConfig>)[],
    })
  }
}

export default Plugin
