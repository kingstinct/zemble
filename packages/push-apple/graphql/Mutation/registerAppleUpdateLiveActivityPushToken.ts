import pushExpoPlugin from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

const registerAppleUpdateLiveActivityPushToken: MutationResolvers['registerAppleUpdateLiveActivityPushToken'] = async (_, {
  token, appBundleId,
}, { decodedToken }) => {
  const pushTokenWithMetadata: Zemble.AppleUpdateLiveActivityPushTokenWithMetadata = {
    type: 'APPLE_UPDATE_LIVE_ACTIVITY',
    platform: ApplePushPlatform.Ios,
    pushToken: token,
    appBundleId,
  }

  await pushExpoPlugin.config.persistPushToken(decodedToken!, pushTokenWithMetadata)

  return true
}

export default registerAppleUpdateLiveActivityPushToken
