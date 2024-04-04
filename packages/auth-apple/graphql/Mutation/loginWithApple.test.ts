import { createTestApp } from '@zemble/core/test-utils'
import {
  describe, beforeEach, it, expect,
} from 'bun:test'

import plugin from '../../plugin'
import { graphql } from '../client.generated'
import { AppleAuthenticationUserDetectionStatus, LoginWithAppleDocument } from '../client.generated/graphql'

const LoginConfirmMutation = graphql(`
  mutation LoginWithApple(
    $authorizationCode: String!
    $email: String!
    $fullName: AppleAuthenticationFullName
    $identityToken: String!
    $state: String
    $realUserStatus: AppleAuthenticationUserDetectionStatus!
    $userUUID: String!
  ) {
    loginWithApple(
      authorizationCode: $authorizationCode
      email: $email
      fullName: $fullName
      identityToken: $identityToken
      realUserStatus: $realUserStatus
      state: $state
      userUUID: $userUUID
    ) {
      __typename
      accessToken
    }
  }
`)

describe('Mutation.loginWithAple', () => {
  it('Should return a token', async () => {
    const app = await createTestApp(plugin)

    const email = 'test@example.com'

    const res = await app.gqlRequest(LoginWithAppleDocument, {
      authorizationCode: '000000',
      email,
      identityToken: '000000',
      realUserStatus: AppleAuthenticationUserDetectionStatus.Unsupported,
      userUUID: '000000',
    })

    expect(res.errors).toHaveLength(1)
    expect(res.errors![0]).toHaveProperty('message', '[@zemble/auth-apple] Error validating Apple ID token, the token is probably not valid')
  })

  /* it('Should fail if not requested before', async () => {
    const app = await createTestApp(plugin)

    const email = 'test@example.com'

    const response = await app.gqlRequest(LoginConfirmMutation, { email, code: '000000' })
    expect(response.data).toEqual({
      loginConfirm: {
        __typename: 'CodeNotValidError',
        message: 'Must loginRequest code first, it might have expired',
      },
    })
  }) */
})
