import { createApp } from '@zemble/core'
import { test, expect } from 'bun:test'

import config from './config'

test('Should return world!', async () => {
  const app = await createApp(config)
  const res = await app.hono.request('/')

  expect(await res.text()).toContain('Hello Zemble! Serving ')
})
