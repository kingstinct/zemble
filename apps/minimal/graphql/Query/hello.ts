import type { QueryResolvers } from '../schema.generated'

export const hello: NonNullable<QueryResolvers['hello']> = async (_parent, _arg, _ctx) => 'world!'
