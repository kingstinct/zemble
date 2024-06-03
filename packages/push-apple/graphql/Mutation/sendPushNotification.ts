import { sendPush } from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const sendPushNotification: MutationResolvers['sendPushNotification'] = async (_, { body, title, subtitle }) => {
  await sendPush([
    {
      createdAt: new Date(),
      platforms: ['ios'],
      pushToken: process.env['DEVICE_TOKEN']!,
      type: 'APPLE',
    },
  ], { body, title, subtitle })
  return true
}

export default sendPushNotification
