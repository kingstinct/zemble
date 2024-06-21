import type { QueryResolvers } from '../schema.generated'

export const hello: QueryResolvers['hello'] = () => 'world!'

export default hello
