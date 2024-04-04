import { verifyJwt } from 'zemble-plugin-auth/utils/verifyJwt'

import plugin from '../plugin'

export const validateOAuthStateJWT = async (state: string): Promise<boolean> => {
  try {
    await verifyJwt(state, plugin.config.PUBLIC_KEY)

    return true
  } catch (error) {
    return false
  }
}
