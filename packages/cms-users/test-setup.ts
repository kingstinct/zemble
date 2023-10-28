/* eslint-disable import/no-extraneous-dependencies */
import { startInMemoryInstanceAndConfigurePlugin, closeAndStopInMemoryInstance, emptyAllCollections } from '@zemble/mongodb/test-in-memory-utils'
import cmsPapr from 'zemble-plugin-cms/clients/papr'

import { connect, disconnect } from './clients/papr'
import plugin from './plugin'

export const setupBeforeAll = async () => {
  await startInMemoryInstanceAndConfigurePlugin()

  await plugin.testApp()

  await connect()
  await cmsPapr.connect()
}

export const teardownAfterAll = async () => {
  await Promise.all([disconnect(), cmsPapr.disconnect()])

  await closeAndStopInMemoryInstance()
}

export const tearDownAfterEach = async () => {
  await emptyAllCollections()
}
