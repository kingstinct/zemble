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

const logFn = (levelToLog: LevelWithSilentOrString, minLevelToLog: LevelWithSilentOrString): LogFn => (...args) => {
  if (minLevelToLog === 'silent') {
    return
  }

  const shouldLog = severitiesInOrder.indexOf(levelToLog) <= severitiesInOrder.indexOf(minLevelToLog)
  if (shouldLog) {
    const callFn = (Object.keys(console).includes(levelToLog) ? levelToLog : (levelToLog === 'fatal' ? 'error' : 'log'))
    // @ts-expect-error fix later
    console[callFn](...args)
  }
}

const createLogger = () => {
  let obj = {
    level: defaultDebugLevel,
  }

  severitiesInOrder.forEach((level) => {
    obj = {
      ...obj,
      [level]: logFn(level, obj.level),
    }
  })

  return obj as unknown as Zemble.GlobalContext['logger']
}

export default createLogger
