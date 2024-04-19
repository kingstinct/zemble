import { test, expect } from 'bun:test'

import { signJwt } from './signJwt'

test('Should sign JWT', async () => {
  const token = await signJwt({ data: { }, sub: '1' })
  expect(token).toEqual(expect.any(String))
})
