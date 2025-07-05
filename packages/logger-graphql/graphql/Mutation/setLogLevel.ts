import type { MutationResolvers } from '../schema.generated'

export const setLogLevel: NonNullable<MutationResolvers['setLogLevel']> = (
  _,
  { level },
  { logger },
) => {
  logger.level = level

  return level
}

export default setLogLevel
