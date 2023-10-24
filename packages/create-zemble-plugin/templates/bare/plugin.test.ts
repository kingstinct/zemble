import { test, expect } from 'bun:test'

import plugin from './plugin'

test('Should return world!', async () => {
  const app = await plugin.testApp()
  const res = await app.request('/')

  expect(await res.text()).toContain('Hello Zemble! Serving test-13')
})
