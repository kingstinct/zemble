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

export const defaultProdConfig = {}

export const defaultDevConfig = {
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          translateTime: 'HH:MM:ss',
          // singleLine: true,
          messageFormat: '{if pluginName}[{pluginName}@{pluginVersion}]{end} {msg}',

          // messageFormat: (log, messageKey, levelLabel) => {
          //   console.log('HEGSFDGDFG')
          //   return `${log.time} ${levelLabel} ${log.hostname} ${log.pid}`
          // },
          messageKey: 'msg',
          ignore: 'pid,req.hostname,req.remoteAddress,req.remotePort,hostname,pluginName,pluginVersion',
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
      level: 'warn',
      options: {
        ...target.options,
        colorize: false,
      },
    })),
  },
}

export default new Plugin<LoggerConfig>(
  import.meta.dir,
  {
    middleware: ({
      app, plugins, config, context,
    }) => {
      const defaultConfig = process.env.NODE_ENV === 'production' ? defaultProdConfig
        : (process.env.NODE_ENV === 'test' ? defaultTestConfig
          : defaultDevConfig)

      const logger = pino(config.logger ?? defaultConfig)

      // eslint-disable-next-line functional/immutable-data, no-param-reassign
      app.providers.logger = logger

      // eslint-disable-next-line functional/immutable-data
      context.logger = logger

      pinoDebug(logger)

      plugins.forEach((plugin) => {
        // eslint-disable-next-line functional/immutable-data, no-param-reassign
        plugin.providers.logger = logger.child({
          pluginName: plugin.pluginName,
          pluginVersion: plugin.pluginVersion,
        })
      })
    },
  },
)
