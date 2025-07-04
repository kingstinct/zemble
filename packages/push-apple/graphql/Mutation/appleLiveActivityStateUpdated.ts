import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const appleLiveActivityStateUpdated: MutationResolvers['appleLiveActivityStateUpdated'] =
  async (_, args, context) => {
    await plugin.config.handleLiveActivityStateChange?.(args, context)

    return true
  }

export default appleLiveActivityStateUpdated
