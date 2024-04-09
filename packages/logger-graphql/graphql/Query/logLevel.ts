import { LogLevel, type QueryResolvers } from '../schema.generated'

import type { LevelWithSilentOrString } from 'pino'

const mapLogLevel: Record<LevelWithSilentOrString, LogLevel> = {
  silent: LogLevel.Silent,
  trace: LogLevel.Trace,
  warn: LogLevel.Warn,
  debug: LogLevel.Debug,
  error: LogLevel.Error,
  fatal: LogLevel.Fatal,
  info: LogLevel.Info,
}

const logLevel: QueryResolvers['logLevel'] = (_, __, { logger }) => mapLogLevel[logger.level]!

export default logLevel
