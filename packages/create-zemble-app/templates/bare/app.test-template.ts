import { test, expect } from 'bun:test'

import appInit from './app'

test('Should return world!', async () => {
  const app = await appInit
  const res = await app.hono.request('/')

  expect(await res.text()).toContain('Hello Zemble! Serving ')
})
