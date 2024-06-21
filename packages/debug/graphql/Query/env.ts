import type { QueryResolvers } from '../schema.generated'

export const env: NonNullable<QueryResolvers['env']> = async () => process.env
