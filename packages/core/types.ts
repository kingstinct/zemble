/* eslint-disable @typescript-eslint/no-namespace */

import type { Plugin, PluginWithMiddleware } from '.'
import type { Hono } from 'hono'

declare global {
  namespace Readapt {
    interface Server extends Hono {

    }

    interface GlobalConfig extends Record<string, unknown> {

    }

    interface Context {
      // eslint-disable-next-line functional/prefer-readonly-type
      config: ConfigPerPlugin
    }

    interface TokenContents extends Record<string, unknown> {

    }

    interface DecodedToken extends TokenContents {
      readonly iat: number
      readonly iss: string
    }

    interface ConfigPerPlugin {
      // eslint-disable-next-line functional/prefer-readonly-type
      [key: string]: Record<string, unknown> | undefined
    }
  }
}

export type Dependency = {
  readonly plugin: Plugin | PluginWithMiddleware,
  readonly devOnly?: boolean, // decides if we should warn if this plugin is not used in production
}

export type DependenciesResolver<TSelf> = readonly Dependency[] | ((self: TSelf) => readonly Dependency[])

export type PluginOpts<TDefault extends Record<string, unknown>, TSelf> = {
  readonly defaultConfig?: TDefault,
  readonly dependencies?: DependenciesResolver<TSelf>,
}

export type ConfiguredMiddleware = (
  opts: {
    readonly plugins: readonly Plugin[],
    readonly app: Readapt.Server,
    readonly context: Readapt.Context
  }
) => Promise<void> | void

export type Middleware<TMiddlewareConfig extends Record<string, unknown>> = (
  config: TMiddlewareConfig
) => ConfiguredMiddleware
