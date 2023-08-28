/* eslint-disable @typescript-eslint/no-namespace */

import type { Plugin, PluginWithMiddleware } from '.'
import type { PubSub } from 'graphql-yoga'
import type { Hono } from 'hono'

declare global {
  namespace Readapt {
    interface Server extends Hono {

    }

    interface GlobalConfig extends Record<string, unknown> {

    }

    interface Context {

    }

    interface PubSubTopics {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      readonly [key: string]: any
    }

    interface PubSubType extends PubSub<PubSubTopics>{

    }

    // Extend the TokenRegistry for the new type
    interface TokenRegistry {
      // readonly UnknownToken: Record<string, unknown>
    }

    interface DecodedTokenBase {
      readonly iat: number
      readonly iss: string
    }
  }
}

export type Dependency<TConfig extends Readapt.GlobalConfig = Readapt.GlobalConfig> = {
  readonly plugin: Plugin<TConfig> | PluginWithMiddleware<TConfig>,
  readonly config?: TConfig,
  readonly devOnly?: boolean, // decides if we should warn if this plugin is not used in production
}

export type DependenciesResolver<TSelf> = readonly Dependency[] | ((self: TSelf) => readonly Dependency[])

export type PluginOpts<TDefaultConfig extends Readapt.GlobalConfig, TSelf, TConfig extends Readapt.GlobalConfig> = {
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

  readonly devConfig?: TConfig,
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
