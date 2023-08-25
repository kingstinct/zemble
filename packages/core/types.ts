import { configDotenv } from "dotenv";
import { readPackageJson } from "./utils/readPackageJson";
import { Hono } from "hono";
import configure from "./server";

configDotenv()

declare global {
  namespace Readapt {
    interface GlobalConfig {

    }

    interface Context {

    }
  }
}

export type ConfiguredMiddleware = (
  opts: {
    plugins: PluginConfig<{}>[], 
    app: Hono, 
    context: Readapt.Context
  }
) => Promise<void> | void

export type Middleware<TMiddlewareConfig extends Record<string, unknown> = {}> = (
  config?: TMiddlewareConfig
) => ConfiguredMiddleware

export class PluginConfig<
  TIn extends Record<string, unknown> & Readapt.GlobalConfig = {},
  TDefault extends TIn = TIn, 
  TOut extends TIn & TDefault = TIn & TDefault & Readapt.GlobalConfig
> {
  config: TOut
  #defaultConfig?: TDefault
  pluginPath: string
  pluginName: string

  constructor(__dirname: string, opts?: {defaultConfig?: TDefault}) {
    this.pluginPath = __dirname
    this.config = (opts?.defaultConfig ?? {}) as TOut // TODO: might need some cleaning up
    this.#defaultConfig = opts?.defaultConfig
    this.pluginName = readPackageJson().name

    if(process.env.PLUGIN_DEV){
      //this.runStandalone()
    }
  }

  configurePlugin(config?: TIn) {
    this.config = { ...this.#defaultConfig, ...config } as TOut
    console.debug(`Initializing plugin ${this.pluginName} with config:`, JSON.stringify(
      this.config, 
      null, 2
    ))
    return this
  }


  get pluginAsApp(){
    const config = configure({
      plugins: [
        this.configurePlugin()
      ],
    })

    return config.getApp()
  }

  get runPluginAsApp(){
    const config = configure({
      plugins: [
        this.configurePlugin()
      ]
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
  #middleware: Middleware<TMiddlewareConfig>

  constructor(__dirname: string, middleware: Middleware<TMiddlewareConfig>, opts?: {defaultConfig?: TDefault}) {
    super(__dirname, opts)
    this.#middleware = middleware
  }

  get pluginAsApp(){
    const config = configure({
      plugins: [
        this.configurePlugin()
      ],
      middleware: [
        this.configureMiddleware()
      ]
    })

    return config.getApp()
  }

  get runPluginAsApp(){
    const config = configure({
      plugins: [
        this.configurePlugin()
      ],
      middleware: [
        this.configureMiddleware()
      ]
    })
    return config.start()
  }

  configureMiddleware(config?: TMiddlewareConfig) {
    return this.#middleware(config)
  }
}

export default PluginConfig