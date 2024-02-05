/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import { Plugin } from '@zemble/core'
import pino from 'pino'
// @ts-expect-error no types available
// eslint-disable-next-line import/no-extraneous-dependencies
import pinoDebug from 'pino-debug'

import type pinopretty from 'pino-pretty'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    /* interface MiddlewareConfig {
      readonly ['zemble-plugin-email-sendgrid']?: Zemble.DefaultMiddlewareConfig
    } */

    interface Providers {
      // eslint-disable-next-line functional/prefer-readonly-type
      logger: pino.Logger
    }
  }
}

interface LoggerConfig extends Zemble.GlobalConfig {
  readonly logger?: pino.LoggerOptions
}

export const defaultProdConfig = {
  level: process.env.LOG_LEVEL ?? 'info',
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
        level: process.env.LOG_LEVEL ?? 'debug',
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
      level: process.env.LOG_LEVEL ?? 'warn',
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
    middleware: ({
      app, config, context,
    }) => {
      const defaultConfig = process.env.NODE_ENV === 'production' ? defaultProdConfig
        : (process.env.NODE_ENV === 'test' ? defaultTestConfig
          : defaultDevConfig)

      const logger = pino(config.logger ?? defaultConfig)

      app.providers.logger = logger

      context.logger = logger

      pinoDebug(logger)

      app.plugins.forEach((plugin) => {
        plugin.providers.logger = logger.child({
          pluginName: plugin.pluginName,
          pluginVersion: plugin.pluginVersion,
        })
      })
    },
  },
)
