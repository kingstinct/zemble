import plugin, { updateLiveActivity } from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

const updateLiveActivityResolver: MutationResolvers['updateLiveActivity'] = async (_, { data, liveActivityId }) => {
  await updateLiveActivity([
    {
      createdAt: new Date(),
      platforms: [ApplePushPlatform.Ios],
      appBundleId: plugin.config.DEFAULT_TOPIC!,
      pushToken: process.env['DEVICE_TOKEN']!,
      type: 'APPLE_UPDATE_LIVE_ACTIVITY',
      liveActivityId,
    },
  ], { contentState: data, event: 'update' })

  return true
}

export default updateLiveActivityResolver
