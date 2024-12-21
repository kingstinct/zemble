import { createTestApp } from '@zemble/core/test-utils'
import { test, expect } from 'bun:test'

import plugin, { migrateUp } from './plugin'

test('Should return world!', async () => {
  const app = await createTestApp(plugin)
  const res = await app.hono.request('/')

  expect(await res.text()).toContain('Hello Zemble! Serving ')
})

test('migrateUp', async () => {
  const app = await createTestApp(plugin)
  const count = await migrateUp({

  })
  expect(count).toBe(0)
})
