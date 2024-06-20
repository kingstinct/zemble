import pushExpoPlugin, { type ExpoPushTokenWithMetadata } from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const registerExpoPushToken: MutationResolvers['registerExpoPushToken'] = async (_, { platform, pushToken }, { decodedToken }) => {
  const pushTokenWithMetadata: ExpoPushTokenWithMetadata = {
    type: 'EXPO',
    platform,
    pushToken,
  }

  await pushExpoPlugin.config.persistPushToken(decodedToken!, pushTokenWithMetadata)

  return true
}

export default registerExpoPushToken
