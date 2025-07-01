import pushExpoPlugin from '../../plugin'

import type { ApplePushTokenWithMetadata } from '../../types'
import type { MutationResolvers } from '../schema.generated'

const registerApplePushToken: MutationResolvers['registerApplePushToken'] = async (_, { platform, token, appBundleId, isSandbox }, { decodedToken }) => {
  const pushTokenWithMetadata: ApplePushTokenWithMetadata = {
    type: 'APPLE',
    platform,
    pushToken: token,
    appBundleId,
    isSandbox: isSandbox ?? false,
  }

  await pushExpoPlugin.config.persistPushToken(decodedToken!, pushTokenWithMetadata)

  return true
}

export default registerApplePushToken
