import pushExpoPlugin from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

import type { AppleUpdateLiveActivityPushTokenWithMetadata } from '../../types'

const registerAppleUpdateLiveActivityPushToken: MutationResolvers['registerAppleUpdateLiveActivityPushToken'] = async (_, {
  token, appBundleId, isSandbox,
}, { decodedToken }) => {
  const pushTokenWithMetadata: AppleUpdateLiveActivityPushTokenWithMetadata = {
    type: 'APPLE_UPDATE_LIVE_ACTIVITY',
    platform: ApplePushPlatform.Ios,
    pushToken: token,
    appBundleId,
    isSandbox: isSandbox ?? false,
  }

  await pushExpoPlugin.config.persistPushToken(decodedToken!, pushTokenWithMetadata)

  return true
}

export default registerAppleUpdateLiveActivityPushToken
