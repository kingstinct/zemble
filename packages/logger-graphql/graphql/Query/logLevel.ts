import type { QueryResolvers } from '../schema.generated'

const logLevel: QueryResolvers['logLevel'] = (_, __, { logger }) => logger.level

export default logLevel
