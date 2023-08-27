/* eslint-disable @typescript-eslint/no-namespace */
import { verifyJwt } from 'readapt-plugin-auth/utils/verifyJwt'

import plugin from '../plugin'

const { INVALIDATE_API_KEYS_IAT_BEFORE } = plugin.config

export const isAPIKeyValid = (token: string) => {
  const keyContents = verifyJwt(token)

  return 'isAPIKey' in keyContents && !!keyContents.isAPIKey && INVALIDATE_API_KEYS_IAT_BEFORE < keyContents.iat
}
