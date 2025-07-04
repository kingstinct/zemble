import type { LevelWithSilentOrString } from 'pino'
import { LogLevel, type QueryResolvers } from '../schema.generated'

const mapLogLevel: Record<LevelWithSilentOrString, LogLevel> = {
  silent: LogLevel.Silent,
  trace: LogLevel.Trace,
  warn: LogLevel.Warn,
  debug: LogLevel.Debug,
  error: LogLevel.Error,
  fatal: LogLevel.Fatal,
  info: LogLevel.Info,
}

export const logLevel: NonNullable<QueryResolvers['logLevel']> = (
  _,
  __,
  { logger },
) => mapLogLevel[logger.level]!

export default logLevel
