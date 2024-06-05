import pushExpoPlugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const registerApplePushToken: MutationResolvers['registerApplePushToken'] = async (_, { platform, token, appBundleId }, { decodedToken }) => {
  const pushTokenWithMetadata: Zemble.ApplePushTokenWithMetadata = {
    type: 'APPLE',
    platform,
    pushToken: token,
    appBundleId,
  }

  await pushExpoPlugin.config.persistPushToken(decodedToken!, pushTokenWithMetadata)

  return true
}

export default registerApplePushToken
