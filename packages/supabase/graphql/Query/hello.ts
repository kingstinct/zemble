import type { QueryResolvers } from '../schema.generated'

export const hello: NonNullable<QueryResolvers['hello']> = () => 'world!'

export default hello
