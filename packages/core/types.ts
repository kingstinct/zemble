/* eslint-disable @typescript-eslint/no-namespace */

import type { Plugin, PluginWithMiddleware } from '.'
import type { PubSub } from 'graphql-yoga'
import type {
  Hono, Context as HonoContext,
} from 'hono'

export interface IEmail {
  readonly email: string
  readonly name?: string
}

export type IStandardSendEmailService = (options: {
  readonly to: readonly IEmail[] | IEmail | string | readonly string[],
  readonly html?: string,
  readonly text: string,
  readonly subject: string,
  readonly from: IEmail | string,
}) => Promise<boolean>

export abstract class IStandardKeyValueService<T = unknown> {
  abstract set(key: string, value: T, expireAfterSeconds?: number): Promise<void> | void

  abstract get(key: string): Promise<T | null> | T | null

  abstract has(key: string): Promise<boolean> | boolean

  abstract delete(key: string): Promise<void> | void

  abstract size(): Promise<number> | number

  abstract clear(): Promise<void> | void

  abstract keys(): Promise<readonly string[]> | readonly string[]

  abstract values(): Promise<ReadonlyArray<T>> | ReadonlyArray<T>

  abstract entries(): Promise<readonly (readonly [string, T])[]> | readonly (readonly [string, T])[]
}

interface IStandardLogger extends Pick<typeof console, 'log' | 'debug' | 'warn' | 'error' | 'info' |'time' |'timeEnd'> {

}

declare global {
  namespace Zemble {
    interface HonoVariables extends Record<string, unknown> {

    }

    interface HonoBindings extends Record<string, unknown> {
      // eslint-disable-next-line functional/prefer-readonly-type
      logger: IStandardLogger
      // eslint-disable-next-line functional/prefer-readonly-type
      kv: <T extends Zemble.KVPrefixes[K], K extends keyof Zemble.KVPrefixes = keyof Zemble.KVPrefixes>(prefix: K) => IStandardKeyValueService<T>
    }

    interface HonoEnv {
      readonly Variables: HonoVariables
      readonly Bindings: HonoBindings
    }

    interface RouteContext extends HonoContext<HonoEnv> {

    }

    interface App {
      readonly hono: Hono<HonoEnv>
      readonly appDir: string

      readonly runBeforeServe: readonly RunBeforeServeFn[]
    }

    interface MiddlewareConfig {

    }

    interface GlobalConfig {
      readonly middleware?: MiddlewareConfig
    }

    interface KVPrefixes extends Record<string, unknown> {
      // allow typing and extending prefixes
      // readonly 'test': {
      //   readonly 'yo': string
      // }

    }

    // optional standard services here, so we can override them
    interface BaseStandardContext {
      // eslint-disable-next-line functional/prefer-readonly-type
      sendEmail?: IStandardSendEmailService
      // eslint-disable-next-line functional/prefer-readonly-type
    }

    interface GlobalContext extends BaseStandardContext {
      // eslint-disable-next-line functional/prefer-readonly-type
      logger: IStandardLogger
      // eslint-disable-next-line functional/prefer-readonly-type
      kv: <T extends Zemble.KVPrefixes[K], K extends keyof Zemble.KVPrefixes = keyof Zemble.KVPrefixes>(prefix: K) => IStandardKeyValueService<T>
    }

    interface RequestContext extends GlobalContext, HonoContext {

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

export type TokenContents = Zemble.TokenRegistry[keyof Zemble.TokenRegistry] & Zemble.DecodedTokenBase

export type Dependency<TConfig extends Zemble.GlobalConfig = Zemble.GlobalConfig> = {
  readonly plugin: Plugin<TConfig> | PluginWithMiddleware<TConfig>,
  readonly config?: TConfig,
  readonly devOnly?: boolean, // decides if we should warn if this plugin is not used in production
}

export type DependenciesResolver<TSelf> = readonly Dependency[] | ((self: TSelf) => readonly Dependency[])

export type PluginOpts<TDefaultConfig extends Zemble.GlobalConfig, TSelf, TConfig extends Zemble.GlobalConfig> = {
  /**
   * Default config for the plugin, will be merged (last write wins) with any configs passed to configure()
   */
  readonly defaultConfig?: TDefaultConfig,
  /**
   * Dependencies required for the plugin to work, specify devOnly: true if the plugin is only used in development (for
   * example a specific implementation of authentication when you don't have a strict dependency on which auth module
   * is used)
   */
  readonly dependencies?: DependenciesResolver<TSelf>

  readonly devConfig?: TConfig,

  readonly name?: string,
  readonly version?: string,
}

export type RunBeforeServeFn = (() => Promise<void>) | (() => void)

// a middleware can return a function that will be called when the server is started
export type MiddlewareReturn = Promise<void> | void | RunBeforeServeFn | Promise<RunBeforeServeFn>

export type Middleware<TMiddlewareConfig extends Zemble.GlobalConfig> = (
  opts: {
    readonly plugins: readonly Plugin<Zemble.GlobalConfig>[],
    readonly app: Pick<Zemble.App, 'hono' |'appDir'>,
    readonly context: Zemble.GlobalContext
    readonly config: TMiddlewareConfig
  }
) => MiddlewareReturn
