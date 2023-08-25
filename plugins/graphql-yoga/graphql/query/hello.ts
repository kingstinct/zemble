import { QueryResolvers } from "../schema.generated"

const hello: QueryResolvers['hello'] = (_, __, context) => {
  return 'world!'
}

export default hello