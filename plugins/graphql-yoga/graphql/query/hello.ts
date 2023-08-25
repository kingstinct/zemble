import { QueryResolvers } from "../schema.generated"

const hello: QueryResolvers['hello'] = () => {
  return 'world!'
}

export default hello