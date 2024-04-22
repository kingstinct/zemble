import plugin from '../../plugin'

import type { QueryResolvers } from '../schema.generated'

const { PUBLIC_KEY } = plugin.config

export const publicKey: NonNullable<QueryResolvers['publicKey']> = async () => PUBLIC_KEY

export default publicKey
