import { expect, test } from 'bun:test'
import { createApp } from '@zemble/core'

import config from './config'

test('Should return world!', async () => {
  const app = await createApp(config)
  const res = await app.hono.request('/')

  expect(await res.text()).toContain('Hello Zemble! Serving ')
})
