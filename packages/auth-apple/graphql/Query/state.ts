import { generateOAuthStateJWT } from '../../utils/generateOAuthStateJWT'

import type { QueryResolvers } from '../schema.generated'

export const state: NonNullable<QueryResolvers['state']> = generateOAuthStateJWT

export default state
