/* eslint-disable functional/immutable-data, import/no-extraneous-dependencies */

import generateKeys from '@zemble/auth/generate-keys'
import { setupEnvOverride, resetEnv, createTestApp } from '@zemble/core/test-utils'
import zembleContext from '@zemble/core/zembleContext'
import { startInMemoryInstanceAndConfigurePlugin, closeAndStopInMemoryInstance, emptyAllCollections } from '@zemble/mongodb/test-utils'

import papr from './clients/papr'
import plugin from './plugin'
import { mockAndReset } from './utils/fs'

export const setupBeforeAll = async () => {
  const { privateKey, publicKey } = await generateKeys()

  setupEnvOverride({ PUBLIC_KEY: publicKey, PRIVATE_KEY: privateKey })

  await startInMemoryInstanceAndConfigurePlugin()

  await createTestApp(plugin)

  await papr.connect({ logger: zembleContext.logger })

  await mockAndReset()
}

export const teardownAfterAll = async () => {
  resetEnv()
  await Promise.all([papr.disconnect()])

  await closeAndStopInMemoryInstance()
}

export const tearDownAfterEach = async () => {
  await emptyAllCollections()

  await mockAndReset()
}
