import pushExpoPlugin from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

const registerAppleUpdateLiveActivityPushToken: MutationResolvers['registerAppleUpdateLiveActivityPushToken'] = async (_, {
  token, appBundleId, liveActivityId,
}, { decodedToken }) => {
  const pushTokenWithMetadata: Zemble.AppleUpdateLiveActivityPushTokenWithMetadata = {
    type: 'APPLE_UPDATE_LIVE_ACTIVITY',
    platforms: [ApplePushPlatform.Ios],
    createdAt: new Date(),
    pushToken: token,
    appBundleId,
    liveActivityId,
  }

  await pushExpoPlugin.config.persistPushToken(decodedToken!, pushTokenWithMetadata)

  return true
}

export default registerAppleUpdateLiveActivityPushToken
