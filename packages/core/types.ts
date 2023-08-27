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

    // Extend the TokenRegistry for the new type
    interface TokenRegistry {
      readonly UnknownToken: Record<string, unknown>
    }

    type TokenContents<T extends keyof TokenRegistry = keyof TokenRegistry> = TokenRegistry[T]

    interface DecodedTokenBase {
      readonly iat: number
      readonly iss: string
    }

    type DecodedToken<T extends keyof TokenRegistry = keyof TokenRegistry> = TokenContents<T> & DecodedTokenBase
  }
}

export type Dependency = {
  readonly plugin: Plugin<Readapt.GlobalConfig> | PluginWithMiddleware<Readapt.GlobalConfig>,
  readonly devOnly?: boolean, // decides if we should warn if this plugin is not used in production
}

export type DependenciesResolver<TSelf> = readonly Dependency[] | ((self: TSelf) => readonly Dependency[])

export type PluginOpts<TDefaultConfig extends Readapt.GlobalConfig, TSelf> = {
  /**
   * Default config for the plugin, will be merged (last write wins) with any configs passed to configure()
   */
  readonly defaultConfig?: TDefaultConfig,
  /**
   * Dependencies required for the plugin to work, specify devOnly: true if the plugin is only used in development (for
   * example a specific implementation of authentication when you don't have a strict dependency on which auth module
   * is used)
   */
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
