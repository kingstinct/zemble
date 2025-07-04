import type { QueryResolvers } from '../schema.generated'

const privateShitWithRole: QueryResolvers['privateShitWithRole'] = () =>
  'private shit'

export default privateShitWithRole
