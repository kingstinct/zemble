import plugin, { updateLiveActivity } from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

const updateLiveActivityResolver: MutationResolvers['updateLiveActivity'] = async (_, { data }) => {
  await updateLiveActivity([
    {
      platform: ApplePushPlatform.Ios,
      appBundleId: plugin.config.DEFAULT_TOPIC!,
      pushToken: process.env['LIVE_ACTIVITY_TOKEN']!,
      type: 'APPLE_UPDATE_LIVE_ACTIVITY',
    },
  ], { contentState: data, event: 'update' })

  return true
}

export default updateLiveActivityResolver
