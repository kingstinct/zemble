import { PluginWithMiddleware } from '@zemble/core'

import middleware from './middleware'

export interface RoutesGlobalConfig {
  readonly rootUrl?: string
  readonly rootPath?: string
  readonly disable?: boolean
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['@zemble/routes']?: RoutesGlobalConfig
    }
  }
}

export interface RoutesConfig extends Zemble.GlobalConfig {

}

const defaultConfig = {

} satisfies RoutesConfig

export default new PluginWithMiddleware<RoutesConfig>(
  import.meta.dir,
  middleware,
  { defaultConfig },
)
