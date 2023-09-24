/* eslint-disable @typescript-eslint/no-namespace */
import { GraphQLError } from 'graphql'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const { API_KEY_SECRET } = plugin.config

const generateAPIKey: MutationResolvers['generateAPIKey'] = async (_: unknown, { expiresInSeconds, apiKeySecret }) => {
  if (apiKeySecret !== API_KEY_SECRET) {
    throw new GraphQLError('Invalid apiKeySecret')
  }

  return {
    apiKey: await signJwt({
      data: { isAPIKey: true },
      expiresInSeconds: expiresInSeconds ?? undefined,
    }),
  }
}

export default generateAPIKey
