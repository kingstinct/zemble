import type { MutationResolvers } from '../schema.generated'

export const setLogLevel: NonNullable<MutationResolvers['setLogLevel']> = (
  _,
  { level },
  { logger },
) => {
  // eslint-disable-next-line functional/immutable-data, no-param-reassign
  logger.level = level

  return level
}

export default setLogLevel
