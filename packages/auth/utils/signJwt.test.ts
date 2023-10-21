import { test, expect } from 'bun:test'

import { signJwt } from './signJwt'

test('Should sign JWT', async () => {
  const token = await signJwt({ data: { } })
  // @ts-expect-error bun next release might fix this?
  expect(token).toEqual(expect.any(String))
})
