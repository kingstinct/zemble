import pushExpoPlugin from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

const registerAppleStartLiveActivityPushToken: MutationResolvers['registerAppleStartLiveActivityPushToken'] = async (_, {
  token, appBundleId,
}, { decodedToken }) => {
  const pushTokenWithMetadata: Zemble.AppleStartLiveActivityPushTokenWithMetadata = {
    type: 'APPLE_START_LIVE_ACTIVITY',
    platforms: [ApplePushPlatform.Ios],
    createdAt: new Date(),
    pushToken: token,
    appBundleId,
  }

  await pushExpoPlugin.config.persistPushToken(decodedToken!, pushTokenWithMetadata)

  return true
}

export default registerAppleStartLiveActivityPushToken
