import type { MutationResolvers } from '../schema.generated'

const logLevel: MutationResolvers['setLogLevel'] = (_, { level }, { logger }) => {
  // eslint-disable-next-line functional/immutable-data, no-param-reassign
  logger.level = level

  return level
}

export default logLevel
