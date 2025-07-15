import { LogLevel, type QueryResolvers } from '../schema.generated'

export const logLevel: NonNullable<QueryResolvers['logLevel']> = () => {
  // LogTape doesn't expose current level directly at runtime
  // Return the configured level based on environment
  const envLevel = process.env['LOG_LEVEL'] ?? 'info'

  switch (envLevel) {
    case 'silent':
      return LogLevel.Silent
    case 'trace':
      return LogLevel.Trace
    case 'debug':
      return LogLevel.Debug
    case 'warn':
      return LogLevel.Warn
    case 'error':
      return LogLevel.Error
    case 'fatal':
      return LogLevel.Fatal
    default:
      return LogLevel.Info
  }
}

export default logLevel
