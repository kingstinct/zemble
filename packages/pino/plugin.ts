/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import { Plugin, setupProvider } from '@zemble/core'
import mergeDeep from '@zemble/core/utils/mergeDeep'
import pino from 'pino'
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-expect-error pino-debug does not have types
import pinoDebug from 'pino-debug'

import type pinopretty from 'pino-pretty'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface Providers {
      readonly pinoLogger: pino.Logger
    }

    interface MiddlewareConfig {
      readonly ['@zemble/pino']?: undefined
    }
  }
}

interface LoggerConfig extends Zemble.GlobalConfig {
  readonly logger?: pino.LoggerOptions
}

export const defaultProdConfig = {
  level: process.env['LOG_LEVEL'] ?? 'info',
} satisfies pino.LoggerOptions

export const defaultDevConfig = {
  hooks: {
    logMethod(inputArgs, method) {
      method.apply(this, inputArgs)
    },
  },
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: process.env['LOG_LEVEL'] ?? 'debug',
        options: {
          translateTime: 'HH:MM:ss',
          messageFormat: '{if pluginName}[{pluginName}@{pluginVersion}]{end} {if middlewarePluginName}({middlewarePluginName}@{middlewarePluginVersion}){end} {msg}',
          ignore: 'pid,req.hostname,req.remoteAddress,req.remotePort,hostname,pluginName,pluginVersion,middlewarePluginName,middlewarePluginVersion',
        } satisfies pinopretty.PrettyOptions,
      },
    ],
  },
} satisfies pino.LoggerOptions

export const defaultTestConfig = {
  ...defaultDevConfig,
  transport: {
    ...defaultDevConfig.transport,
    targets: defaultDevConfig.transport.targets.map((target) => ({
      ...target,
      level: process.env['LOG_LEVEL'] ?? 'warn',
      options: {
        ...target.options,
        colorize: false,
      },
    })),
  },
} satisfies pino.LoggerOptions

export default new Plugin<LoggerConfig>(
  import.meta.dir,
  {
    middleware: async ({
      app, config, context,
    }) => {
      const defaultConfig = process.env.NODE_ENV === 'production' ? defaultProdConfig
        : (process.env.NODE_ENV === 'test' ? defaultTestConfig
          : defaultDevConfig)

      const logger = pino(mergeDeep(defaultConfig, config.logger ?? {}))

      context.logger = logger

      pinoDebug(logger)

      await setupProvider({
        app,
        initializeProvider: (_, plugin) => logger.child({
          pluginName: plugin?.pluginName,
          pluginVersion: plugin?.pluginVersion,
        }),
        middlewareKey: '@zemble/pino',
        providerKey: 'logger',
        alwaysCreateForEveryPlugin: true,
      })
      await setupProvider({
        app,
        initializeProvider: (_, plugin) => logger.child({
          pluginName: plugin?.pluginName,
          pluginVersion: plugin?.pluginVersion,
        }) as pino.Logger,
        middlewareKey: '@zemble/pino',
        providerKey: 'pinoLogger',
        alwaysCreateForEveryPlugin: true,
      })
    },
  },
)
