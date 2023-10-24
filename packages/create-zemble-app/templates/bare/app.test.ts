import { test, expect } from 'bun:test'

import appInit from './app'

test('Should return world!', async () => {
  const app = await appInit
  const res = await app.request('/')

  expect(await res.text()).toEqual('Hello world!')
})
