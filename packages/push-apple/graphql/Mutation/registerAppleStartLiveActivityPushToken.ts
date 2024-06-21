import pushExpoPlugin from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

import type { AppleStartLiveActivityPushTokenWithMetadata } from '../../types'

const registerAppleStartLiveActivityPushToken: MutationResolvers['registerAppleStartLiveActivityPushToken'] = async (_, {
  token, appBundleId, isSandbox,
}, { decodedToken }) => {
  const pushTokenWithMetadata: AppleStartLiveActivityPushTokenWithMetadata = {
    type: 'APPLE_START_LIVE_ACTIVITY',
    platform: ApplePushPlatform.Ios,
    pushToken: token,
    appBundleId,
    isSandbox: isSandbox ?? false,
  }

  await pushExpoPlugin.config.persistPushToken(decodedToken!, pushTokenWithMetadata)

  return true
}

export default registerAppleStartLiveActivityPushToken
