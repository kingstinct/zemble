import {
  type LevelWithSilentOrString,
} from 'pino'

interface LogFn {
  (obj: unknown, msg?: string, ...args: readonly unknown[]): void;
  (msg: string, ...args: readonly unknown[]): void;
}

const severitiesInOrder: readonly LevelWithSilentOrString[] = [
  'fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent',
]

const defaultDebugLevel = 'info'

const logFn = (levelToLog: LevelWithSilentOrString, minLevelToLog: LevelWithSilentOrString, extraData?: object): LogFn => (...args) => {
  if (minLevelToLog === 'silent') {
    return
  }

  const shouldLog = severitiesInOrder.indexOf(levelToLog) <= severitiesInOrder.indexOf(minLevelToLog)
  if (shouldLog) {
    const callFn = (Object.keys(console).includes(levelToLog) ? levelToLog : (levelToLog === 'fatal' ? 'error' : 'log'))

    if (extraData) {
      if (typeof args[0] === 'string') {
        // @ts-expect-error fix later
        // eslint-disable-next-line no-console
        console[callFn](`${args[0]} ${JSON.stringify(extraData)}`, ...args.slice(1))
      } else if (typeof args[0] === 'object') {
        // @ts-expect-error fix later
        // eslint-disable-next-line no-console
        console[callFn]({ ...extraData, ...args[0] }, ...args.slice(1))
      } else {
        // @ts-expect-error fix later
        // eslint-disable-next-line no-console
        console[callFn](JSON.stringify(extraData), ...args)
      }
    } else {
      // @ts-expect-error fix later
    // eslint-disable-next-line no-console
      console[callFn](...args)
    }
  }
}

const createLogger = (extraData?: object) => {
  let obj = {
    level: defaultDebugLevel,
    child: (moreData?: object) => createLogger(moreData
      ? { ...extraData, ...moreData }
      : extraData),
  }

  severitiesInOrder.forEach((level) => {
    obj = {
      ...obj,
      [level]: logFn(level, obj.level, extraData),
    }
  })

  return obj as unknown as Zemble.GlobalContext['logger']
}

export default createLogger
