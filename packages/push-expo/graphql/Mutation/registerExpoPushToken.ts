import pushExpoPlugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const registerExpoPushToken: MutationResolvers['registerExpoPushToken'] = async (_, { platform, pushToken }, { decodedToken }) => {
  const pushTokenWithMetadata: Zemble.ExpoPushTokenWithMetadata = {
    type: 'EXPO',
    platforms: [platform],
    createdAt: new Date(),
    pushToken,
  }

  await pushExpoPlugin.config.persistPushToken(decodedToken!, pushTokenWithMetadata)

  return true
}

export default registerExpoPushToken
