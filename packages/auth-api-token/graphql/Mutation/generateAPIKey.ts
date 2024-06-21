import { signJwt } from '@zemble/auth/utils/signJwt'
import { GraphQLError } from 'graphql'

import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const { API_KEY_SECRET } = plugin.config

export const generateAPIKey: NonNullable<MutationResolvers['generateAPIKey']> = async (_: unknown, { expiresInSeconds, apiKeySecret }, { decodedToken }) => {
  if (apiKeySecret !== API_KEY_SECRET) {
    throw new GraphQLError('Invalid apiKeySecret')
  }

  if (!decodedToken) {
    throw new GraphQLError('Token required')
  }

  const token = decodedToken as { readonly sub: string }

  return {
    apiKey: await signJwt({
      data: { isAPIKey: true },
      expiresInSeconds: expiresInSeconds ?? undefined,
      sub: token.sub,
    }),
  }
}

export default generateAPIKey
