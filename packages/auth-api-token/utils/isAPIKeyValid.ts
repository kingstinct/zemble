/* eslint-disable @typescript-eslint/no-namespace */
import { verifyJwt } from '@zemble/auth/utils/verifyJwt'

import plugin from '../plugin'

const { INVALIDATE_API_KEYS_IAT_BEFORE } = plugin.config

export const isAPIKeyValid = async (token: string) => {
  const keyContents = (await verifyJwt(token)) as {
    readonly isAPIKey: boolean
    readonly iat: number
  }

  return (
    'isAPIKey' in keyContents &&
    !!keyContents.isAPIKey &&
    keyContents.iat &&
    INVALIDATE_API_KEYS_IAT_BEFORE < keyContents.iat
  )
}
