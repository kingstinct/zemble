/* eslint-disable import/no-extraneous-dependencies */
import { resetEnv, setupEnvOverride } from '@zemble/auth/test-utils'
import cmsPapr from '@zemble/cms/clients/papr'
import { createTestApp } from '@zemble/core/test-utils'
import zembleContext from '@zemble/core/zembleContext'
import { closeAndStopInMemoryInstance, emptyAllCollections, startInMemoryInstanceAndConfigurePlugin } from '@zemble/mongodb/test-utils'

import { connect, disconnect } from './clients/papr'
import plugin from './plugin'

export const setupBeforeAll = async () => {
  await setupEnvOverride()

  await startInMemoryInstanceAndConfigurePlugin()

  await createTestApp(plugin)

  await connect({ logger: zembleContext.logger })
  await cmsPapr.connect({ logger: zembleContext.logger })
}

export const teardownAfterAll = async () => {
  resetEnv()
  await Promise.all([disconnect(), cmsPapr.disconnect()])

  await closeAndStopInMemoryInstance()
}

export const tearDownAfterEach = async () => {
  await emptyAllCollections()
}
