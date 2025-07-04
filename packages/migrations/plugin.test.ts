import { expect, mock, test } from 'bun:test'
import { runBeforeServe } from '@zemble/core'
import { createTestApp } from '@zemble/core/test-utils'

import plugin, { migrateUp } from './plugin'

test('Should return world!', async () => {
  const app = await createTestApp(plugin)
  const res = await app.hono.request('/')

  expect(await res.text()).toContain('Hello Zemble! Serving ')
})

test('migrateUp', async () => {
  await createTestApp(plugin)
  const { count } = await migrateUp({})
  expect(count).toBe(0)
})

test('beforeStart', async () => {
  const migrateUpMock = mock(migrateUp)
  const app = await createTestApp(plugin)

  await runBeforeServe(app)
  expect(migrateUpMock).toHaveBeenCalledTimes(0)
})
