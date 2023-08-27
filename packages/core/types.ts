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

    }

    interface TokenContents {

    }

    interface DecodedToken extends TokenContents {
      readonly iat: number
      readonly iss: string
    }
  }
}

export type Dependency = {
  readonly plugin: Plugin<Readapt.GlobalConfig> | PluginWithMiddleware<Readapt.GlobalConfig>,
  readonly devOnly?: boolean, // decides if we should warn if this plugin is not used in production
}

export type DependenciesResolver<TSelf> = readonly Dependency[] | ((self: TSelf) => readonly Dependency[])

export type PluginOpts<TDefaultConfig extends Readapt.GlobalConfig, TSelf> = {
  readonly defaultConfig?: TDefaultConfig,
  readonly dependencies?: DependenciesResolver<TSelf>,
}

export type ConfiguredMiddleware = (
  opts: {
    readonly plugins: readonly Plugin<Readapt.GlobalConfig>[],
    readonly app: Readapt.Server,
    readonly context: Readapt.Context
  }
) => Promise<void> | void

export type Middleware<TMiddlewareConfig extends Readapt.GlobalConfig> = (
  config: TMiddlewareConfig
) => ConfiguredMiddleware
