import { test, expect } from 'bun:test'

import { signJwt } from './signJwt'

test('Should sign JWT', async () => {
  const token = await signJwt({ data: { } })
  expect(token).toEqual(expect.any(String))
})
