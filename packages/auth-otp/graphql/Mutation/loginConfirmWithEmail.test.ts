import { beforeEach, describe, expect, it } from 'bun:test'
import { createTestApp } from '@zemble/core/test-utils'
import { loginRequestKeyValue } from '../../clients/loginRequestKeyValue'
import plugin from '../../plugin'
import { graphql } from '../client.generated'
import { LoginRequestMutation } from './loginRequestWithEmail.test'

const LoginConfirmMutation = graphql(`
  mutation LoginConfirm($email: String!, $code: String!) {
    loginConfirmWithEmail(email: $email, code: $code) {
      __typename
      ... on LoginConfirmSuccessfulResponse {
        bearerToken
      }
      ... on Error {
        message
      }
    }
  }
`)

describe('Mutation.loginConfirm', () => {
  beforeEach(async () => {
    await loginRequestKeyValue().clear()
  })

  it('Should return a token', async () => {
    const app = await createTestApp(plugin)

    const email = 'test@example.com'

    await app.gqlRequest(LoginRequestMutation, { email })

    const response = await app.gqlRequest(LoginConfirmMutation, {
      email,
      code: '000000',
    })
    expect(response.data).toEqual({
      loginConfirmWithEmail: {
        __typename: 'LoginConfirmSuccessfulResponse',
        bearerToken: expect.any(String),
      },
    })
  })

  it('Should fail if not requested before', async () => {
    const app = await createTestApp(plugin)

    const email = 'test@example.com'

    const response = await app.gqlRequest(LoginConfirmMutation, {
      email,
      code: '000000',
    })
    expect(response.data).toEqual({
      loginConfirmWithEmail: {
        __typename: 'CodeNotValidError',
        message: 'Must loginRequest code first, it might have expired',
      },
    })
  })
})
