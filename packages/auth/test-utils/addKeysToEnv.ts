import {
  resetEnv,
  setupEnvOverride as setupEnvOverrideOriginal,
} from '@zemble/core/test-utils'

import generateKeys from '../generate-keys'

export const setupEnvOverride = async (additionalArgs = {}, clear = false) => {
  const { privateKey, publicKey } = await generateKeys()

  setupEnvOverrideOriginal(
    { PUBLIC_KEY: publicKey, PRIVATE_KEY: privateKey, ...additionalArgs },
    clear,
  )
}

export { resetEnv }
