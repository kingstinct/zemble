import { sendPush } from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

const sendPushNotification: MutationResolvers['sendPushNotification'] = async (_, { body, title, subtitle }) => {
  await sendPush(
    [
      {
        platform: ApplePushPlatform.Ios,
        appBundleId: process.env['DEFAULT_TOPIC']!,
        pushToken: process.env['DEVICE_TOKEN']!,
        type: 'APPLE',
      },
    ],
    { body, title: title ?? undefined, subtitle: subtitle ?? undefined },
  )
  return true
}

export default sendPushNotification
