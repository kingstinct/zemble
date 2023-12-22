/* eslint-disable import/no-extraneous-dependencies */
import { createTestApp } from '@zemble/core'
import { startInMemoryInstanceAndConfigurePlugin, closeAndStopInMemoryInstance, emptyAllCollections } from '@zemble/mongodb/test-in-memory-utils'

import papr from './clients/papr'
import plugin from './plugin'
import { mockAndReset } from './utils/fs'

export const setupBeforeAll = async () => {
  await startInMemoryInstanceAndConfigurePlugin()

  await createTestApp(plugin)

  await papr.connect()

  await mockAndReset()
}

export const teardownAfterAll = async () => {
  await Promise.all([papr.disconnect()])

  await closeAndStopInMemoryInstance()
}

export const tearDownAfterEach = async () => {
  await emptyAllCollections()

  await mockAndReset()
}
