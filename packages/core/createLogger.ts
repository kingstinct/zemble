import { getLogger } from '@logtape/logtape'
import type { IStandardLogger } from './types'

type CreateLoggerProps = {
  categories?: string | string[]
  extraData?: Record<string, unknown>
}

const createLogger = (props?: CreateLoggerProps): IStandardLogger => {
  const { categories, extraData } = props || {}
  const logger = getLogger(categories)

  if (extraData) {
    return logger.with(extraData)
  }

  return logger
}

export default createLogger
