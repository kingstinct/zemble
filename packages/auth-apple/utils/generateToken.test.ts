import { expect, test } from 'bun:test'
import { decodeJwt } from 'jose'
import plugin, { type DefaultAppleToken } from '../plugin'
import { generateBearerTokenFromAppleToken } from './generateToken'

import type { AppleJwtContents } from './validateIdToken'

test('Should get apple user id as sub', async () => {
  const encodedToken = await generateBearerTokenFromAppleToken(
    { sub: 'apple-uid' } as AppleJwtContents,
    {},
  )

  const decodedToken = decodeJwt(encodedToken.bearerToken)

  expect(decodedToken.sub).toBe('apple-uid')
})

test('Should override sub', async () => {
  const defaultGenerateTokenContents = plugin.config.generateTokenContents
  plugin.config.generateTokenContents = () =>
    ({
      sub: 'overriden-sub',
      appleUserId: 'sdfsdf',
      type: '@zemble/auth-apple',
    }) as DefaultAppleToken
  const encodedToken = await generateBearerTokenFromAppleToken(
    { sub: 'apple-uid' } as AppleJwtContents,
    {},
  )

  const decodedToken = decodeJwt(encodedToken.bearerToken)

  expect(decodedToken.sub).toBe('overriden-sub')

  plugin.config.generateTokenContents = defaultGenerateTokenContents
})
