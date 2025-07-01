import { expect, test } from 'bun:test'
import { createTestApp } from '@zemble/core/test-utils'

import plugin from './plugin'

test('Should return world!', async () => {
  const app = await createTestApp(plugin)
  const res = await app.hono.request('/')

  expect(await res.text()).toContain('Hello Zemble! Serving ')
})
