import { configDotenv } from 'dotenv'

import { createApp } from './server'
import mergeDeep from './utils/mergeDeep'
import { readPackageJson } from './utils/readPackageJson'

import type PluginWithMiddleware from './PluginWithMiddleware'
import type { ReadaptApp } from './server'
import type { DependenciesResolver, Dependency, PluginOpts } from './types'

// initialize dotenv before any plugins are loaded/configured
configDotenv()

export class Plugin<
  TConfig extends Readapt.GlobalConfig = Readapt.GlobalConfig,
  TDefaultConfig extends Partial<TConfig> = TConfig,
  TResolvedConfig extends TConfig & TDefaultConfig = TConfig & TDefaultConfig,
> {
  // eslint-disable-next-line functional/prefer-readonly-type
  #config: TResolvedConfig

  readonly #devConfig?: TConfig

  readonly #dependencies: DependenciesResolver<Plugin<Readapt.GlobalConfig>>

  readonly pluginPath: string

  // eslint-disable-next-line functional/prefer-readonly-type
  #pluginName: string | undefined

  /**
   *
   * @param __dirname This should be the directory of the plugin (usually __dirname), usually containing subdirectories like /routes and /graphql for automatic bootstrapping
   * @param opts
   */
  constructor(__dirname: string, opts?: PluginOpts<TDefaultConfig, Plugin<TConfig, TConfig, TResolvedConfig>, TConfig>) {
    this.pluginPath = __dirname
    this.#config = (opts?.defaultConfig ?? {}) as TResolvedConfig
    this.#devConfig = opts?.devConfig
    // @ts-expect-error not the most important
    this.#dependencies = opts?.dependencies ?? []

    if (this.#isPluginDevMode) {
      void this.#devApp().then((app) => app.start())
    }
  }

  get #isPluginDevMode() {
    return (process.env.PLUGIN_DEV && process.cwd() === this.pluginPath)
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

  /**
   * Warning: don't export this directly from your plugin file, it will snapshot the config at that point in time
   */
  get config() {
    return this.#config
  }

  get dependencies() {
    const allDeps = Promise.resolve((typeof this.#dependencies === 'function') ? this.#dependencies(this) : this.#dependencies)

    return allDeps.then(async (allDeps) => {
      const filteredDeps = allDeps.filter(this.#filterDevDependencies.bind(this))

      const resolvedDeps: Promise<readonly Plugin[]> = Promise.all(filteredDeps
        .map(({ plugin, config }) => plugin.configure(config))
        .flatMap(async (dep) => [dep, ...await dep.dependencies]))
        .then((deps) => deps.flat())

      return resolvedDeps
    })
  }

  async #devApp(): Promise<ReadaptApp> {
    const resolved = this.configure(this.#devConfig)
    return createApp({
      plugins: [
        ...await this.dependencies,
        resolved,
      ] as readonly (Plugin<Readapt.GlobalConfig> | PluginWithMiddleware<Readapt.GlobalConfig>)[],
    })
  }

  async testApp(): Promise<ReadaptApp['app']> {
    const gotApp = (await this.#devApp()).app

    return gotApp
  }
}

export default Plugin
