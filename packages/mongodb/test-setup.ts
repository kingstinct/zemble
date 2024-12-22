/* eslint-disable functional/immutable-data, import/no-extraneous-dependencies */

import generateKeys from '@zemble/auth/generate-keys'
import { setupEnvOverride, resetEnv, createTestApp } from '@zemble/core/test-utils'
import plugin from '@zemble/migrations/plugin'
import { startInMemoryInstanceAndConfigurePlugin, closeAndStopInMemoryInstance, emptyAllCollections } from '@zemble/mongodb/test-utils'

export const setupBeforeAll = async () => {
  const { privateKey, publicKey } = await generateKeys()

  setupEnvOverride({ PUBLIC_KEY: publicKey, PRIVATE_KEY: privateKey })

  await startInMemoryInstanceAndConfigurePlugin({
    replicaSetOptions: {},
  })

  await createTestApp(plugin)
}

export const teardownAfterAll = async () => {
  resetEnv()

  await closeAndStopInMemoryInstance()
}

export const tearDownAfterEach = async () => {
  await emptyAllCollections()
}
