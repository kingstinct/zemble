import type { QueryResolvers } from '../schema.generated'

const hello: QueryResolvers['hello'] = () => 'world!'

export default hello
