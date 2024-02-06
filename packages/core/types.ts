/* eslint-disable @typescript-eslint/no-namespace */

import type { Plugin } from '.'
import type { WebSocketHandler } from 'bun'
import type { PubSub } from 'graphql-yoga'
import type {
  Hono, Context as HonoContext,
} from 'hono'
import type pino from 'pino'

export interface IEmail {
  readonly email: string
  readonly name?: string
}

export type SendEmailParams = {
  readonly to: readonly IEmail[] | IEmail | string | readonly string[],
  readonly html?: string,
  readonly text: string,
  readonly subject: string,
  readonly from: IEmail | string,
  readonly replyTo?: readonly IEmail[] | IEmail | string | readonly string[],
  readonly cc?: readonly IEmail[] | IEmail | string | readonly string[],
  readonly bcc?: readonly IEmail[] | IEmail | string | readonly string[],
}

export type IStandardSendEmailService = (options: SendEmailParams) => Promise<boolean>

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

export interface IStandardLogger extends pino.BaseLogger {
  readonly child: (bindings: Record<string, unknown>) => IStandardLogger
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

    interface DefaultProviders {
      // eslint-disable-next-line functional/prefer-readonly-type
      sendEmail?: IStandardSendEmailService
      // eslint-disable-next-line functional/prefer-readonly-type
      kv: <T extends Zemble.KVPrefixes[K], K extends keyof Zemble.KVPrefixes = keyof Zemble.KVPrefixes>(prefix: K) => IStandardKeyValueService<T>

      // eslint-disable-next-line functional/prefer-readonly-type
      logger: IStandardLogger
    }

    interface Providers extends DefaultProviders {

    }

    interface RouteContext extends HonoContext<HonoEnv> {

    }

    interface App {
      readonly hono: Hono<HonoEnv>
      readonly appDir: string

      // eslint-disable-next-line functional/prefer-readonly-type
      providers: Providers

      readonly runBeforeServe: readonly RunBeforeServeFn[]

      readonly plugins: readonly Plugin[]
      readonly appPlugin?: Plugin
      // eslint-disable-next-line functional/prefer-readonly-type
      websocketHandler?: WebSocketHandler
    }

    interface DefaultMiddlewareConfig {
      readonly disable?: boolean
    }

    interface MiddlewareConfig {

    }

    interface GlobalConfig {
      readonly middleware?: MiddlewareConfig
    }

    interface KVPrefixes extends Record<string, unknown> {

    }

    // optional standard services here, so we can override them
    interface BaseStandardContext {

    }

    interface GlobalContext extends BaseStandardContext {
      // eslint-disable-next-line functional/prefer-readonly-type
      logger: IStandardLogger
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

export type Dependency = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly plugin: Plugin<any, any, any>
  readonly config?: unknown,
  /**
   * To make it easy to write tests and develop a plugin towards an explicit implementation
   * of an interface, but leave it up to the developer using the plugin which implementation to use
   */
  readonly onlyWhenRunningLocally?: boolean,
}

export type DependenciesResolver<TSelf> = readonly Dependency[] | ((self: TSelf) => readonly Dependency[])

export type PluginOpts<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TSelf extends Plugin<any, any, any>,
  TConfig extends Zemble.GlobalConfig = Zemble.GlobalConfig,
  TDefaultConfig extends Partial<TConfig> = TConfig,
  TResolvedConfig extends TConfig & TDefaultConfig = TConfig & TDefaultConfig,
> = {
  /**
   * Default config for the plugin, will be merged (last write wins) with any configs passed to configure()
   */
  readonly defaultConfig?: TDefaultConfig,
  /**
   * Dependencies required for the plugin to work, specify onlyWhenRunningLocally: true if the plugin is only used in
   * development (for example a specific implementation of authentication when you don't have a strict dependency on
   * which auth module
   * is used)
   */
  readonly dependencies?: DependenciesResolver<TSelf>

  readonly additionalConfigWhenRunningLocally?: TConfig,

  readonly name?: string,
  readonly version?: string,

  readonly middleware?: Middleware<TResolvedConfig, Plugin>

  // readonly provides: TSelf['providers']
}

export type RunBeforeServeFn = (() => Promise<void>) | (() => void)

// a middleware can return a function that will be called when the server is started
export type MiddlewareReturn = Promise<void> | void | RunBeforeServeFn | Promise<RunBeforeServeFn>

export type Middleware<TMiddlewareConfig extends Zemble.GlobalConfig, PluginType extends Plugin = Plugin> = (
  opts: {
    readonly app: Pick<Zemble.App, 'hono' |'appDir' |'providers' | 'websocketHandler' | 'appPlugin' | 'plugins'>,
    readonly context: Zemble.GlobalContext
    readonly config: TMiddlewareConfig,
    readonly self: PluginType,
    readonly logger: IStandardLogger,
  }
) => MiddlewareReturn
