import { getLogger } from '@logtape/logtape'
import type { IStandardLogger } from './types'

interface LogFn {
  (obj: unknown, msg?: string, ...args: readonly unknown[]): void
  (msg: string, ...args: readonly unknown[]): void
}

const createLogger = (extraData?: object): IStandardLogger => {
  const logger = getLogger()

  const createLogFunction = (
    level: 'fatal' | 'error' | 'warning' | 'info' | 'debug',
  ): LogFn => {
    return ((objOrMsg: unknown, msg?: string, ...args: readonly unknown[]) => {
      const properties: Record<string, unknown> = extraData
        ? { ...extraData }
        : {}

      if (typeof objOrMsg === 'string' && msg === undefined) {
        // String message format: (msg: string, ...args: readonly unknown[])
        if (args.length > 0) {
          properties.args = args
        }
        logger[level](objOrMsg, properties)
      } else if (msg !== undefined) {
        // Object format: (obj: unknown, msg?: string, ...args: readonly unknown[])
        if (objOrMsg && typeof objOrMsg === 'object') {
          Object.assign(properties, objOrMsg as Record<string, unknown>)
        }
        if (args.length > 0) {
          properties.args = args
        }
        logger[level](msg, properties)
      } else if (objOrMsg && typeof objOrMsg === 'object') {
        // Just an object
        Object.assign(properties, objOrMsg as Record<string, unknown>)
        logger[level](JSON.stringify(objOrMsg), properties)
      } else {
        logger[level](String(objOrMsg), properties)
      }
    }) as LogFn
  }

  // Create a logger that implements the expected interface
  const createdLogger = {
    fatal: createLogFunction('fatal'),
    error: createLogFunction('error'),
    warn: createLogFunction('warning'),
    info: createLogFunction('info'),
    debug: createLogFunction('debug'),
    trace: createLogFunction('debug'), // LogTape doesn't have trace, map to debug
    child: (moreData?: object) =>
      createLogger(moreData ? { ...extraData, ...moreData } : extraData),
  }

  // Add any additional methods from LogTape Logger that might be needed
  return createdLogger as IStandardLogger
}

export default createLogger
