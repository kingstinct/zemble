import { test, expect } from 'bun:test'

import { signJwt } from './signJwt'
import { verifyJwt } from './verifyJwt'
import plugin from '../plugin'

test('Should verify JWT', async () => {
  const encodedToken = await signJwt({ data: { }, sub: 'dsf' })
  const token = await verifyJwt(encodedToken, plugin.config.PUBLIC_KEY!)
  expect(token).toEqual({
    iat: expect.any(Number),
    iss: '@zemble/auth',
    sub: 'dsf',
  })
})
