import plugin, { sendSilentPush } from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

const sendSilentPushNotification: MutationResolvers['sendSilentPushNotification'] = async (_, { data, pushToken }) => {
  await sendSilentPush([
    {
      platform: ApplePushPlatform.Ios,
      appBundleId: plugin.config.DEFAULT_TOPIC!,
      pushToken,
      type: 'APPLE',
    },
  ], data)

  return true
}

export default sendSilentPushNotification
