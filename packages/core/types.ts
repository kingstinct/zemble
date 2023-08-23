import { configDotenv } from "dotenv";
import initialize from "./server";
import { readPackageJson } from "./utils/readPackageJson";
import { Hono } from "hono";

configDotenv()

declare global {
  namespace Readapt {
    interface Config {

    }
  }
}

export class PluginConfig<
  TIn extends Record<string, unknown> & Readapt.Config,
  TDefault extends TIn = TIn, 
  TOut extends TIn & TDefault = TIn & TDefault & Readapt.Config
> {
  config: TOut
  #defaultConfig?: TDefault
  pluginPath: string
  pluginName: string
  middleware?: (plugins: PluginConfig<{}>[], app: Hono, config: TOut) => Promise<void> | void

  constructor(__dirname: string, opts?: {defaultConfig?: TDefault, middleware?: (plugins: PluginConfig<{}>[], app: Hono, config: TOut) => Promise<void> | void}) {
    this.pluginPath = __dirname
    this.config = (opts?.defaultConfig ?? {}) as TOut // TODO: might need some cleaning up
    this.#defaultConfig = opts?.defaultConfig
    this.pluginName = readPackageJson().name
    this.middleware = opts?.middleware

    if(process.env.PLUGIN_DEV){
      this.runStandalone()
    }
  }

  init(config: TIn) {
    this.config = { ...this.#defaultConfig, ...config } as TOut
    console.debug(`Initializing plugin ${this.pluginName} with config:`, JSON.stringify(this.config, null, 2))
    return this
  }

  runStandalone() {
    initialize([this])
  }
}

export default PluginConfig