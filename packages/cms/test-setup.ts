/* eslint-disable import/no-extraneous-dependencies */

import { startInMemoryInstanceAndConfigurePlugin, closeAndStopInMemoryInstance, emptyAllCollections } from '@zemble/mongodb/helpers/test-helper'

import papr from './clients/papr'
import plugin from './plugin'
import { mockAndReset } from './utils/fs'

export const setupBeforeAll = async () => {
  await startInMemoryInstanceAndConfigurePlugin()

  await plugin.testApp()

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
