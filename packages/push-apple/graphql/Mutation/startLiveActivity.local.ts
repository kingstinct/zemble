import plugin, { startLiveActivity } from '../../plugin'
import { ApplePushPlatform, type MutationResolvers } from '../schema.generated'

const startLiveActivityResolver: MutationResolvers['startLiveActivity'] =
  async (_, { data, liveActivityType, pushToken }) => {
    await startLiveActivity(
      [
        {
          platform: ApplePushPlatform.Ios,
          appBundleId: plugin.config.DEFAULT_TOPIC!,
          pushToken,
          type: 'APPLE_START_LIVE_ACTIVITY',
        },
      ],
      {
        contentState: data,
        attributesType: liveActivityType,
        body: 'Starting live activity',
      },
    )

    return {
      liveActivityId: 'res.liveActivityId!',
    }
  }

export default startLiveActivityResolver
