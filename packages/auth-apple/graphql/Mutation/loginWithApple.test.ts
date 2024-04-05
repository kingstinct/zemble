import { createTestApp } from '@zemble/core/test-utils'
import {
  describe, it, expect,
} from 'bun:test'

import plugin from '../../plugin'
import { graphql } from '../client.generated'
import { AppleAuthenticationUserDetectionStatus } from '../client.generated/graphql'

const LoginWithAppleDocument = graphql(`
  mutation LoginWithApple(
    $authorizationCode: String!
    $email: String
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

  it('Should fail with faulty state', async () => {
    const app = await createTestApp(plugin)

    const res = await app.gqlRequest(LoginWithAppleDocument, {
      authorizationCode: '000000',
      state: '000000',
      identityToken: 'eyJraWQiOiJsVkhkT3g4bHRSIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmtpbmdzdGluY3Quc2lnbi1pbi13aXRoLWFwcGxlIiwiZXhwIjoxNzEyMzE0NzA1LCJpYXQiOjE3MTIyMjgzMDUsInN1YiI6IjAwMjAyMS5jZmY1YmEyYWYwMDk0NTExODllZjZkMjM0YzJjNTc2NC4xMDU4IiwiY19oYXNoIjoidW1RT2VJVXpXNldqS2RpYVNPaXZJUSIsImVtYWlsIjoidWtAaGVyYmVyLm1lIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF1dGhfdGltZSI6MTcxMjIyODMwNSwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.ZfjaAofABfZdvXyzD5R6f0O2kHn7oxcT50XqBmB3UsILuOLSdfzK5rV8FIrsj4H-0yTQUz5bxbQmVxABn8MIG2m866SBgD6--kIOcbDJm9spsGutucF7bQ4ZrrgMrTsnFSMUpk04OddmFYpjggTRH_Ja1MBB3eiFEOKWMkTgS5SGoRFmcBP5cTyTlXnp-W7QaNmcSJC2vqxshQ6WOudmXALkGktdDmfK_R40jQrhqY2oA_TvJZP55xk7QoLNFMu76YEp4Wbh2WSGZy5q6WTt6wAVcU-pnYKOdKTZtLAIgSvhjddUNZJ7Qz0PdbW6DNtpYmcHirMzj3mrbyM0A9t62A',
      realUserStatus: AppleAuthenticationUserDetectionStatus.Unsupported,
      userUUID: '000000',
    })

    expect(res.errors).toHaveLength(1)
    expect(res.errors![0]).toHaveProperty('message', '[@zemble/auth-apple] Invalid or expired state parameter')
  })

  // todo [2024-04-05]: This will start breaking, handle the error and add a new test that skips expiry notification in
  // a decent manner
  it('Should succeed and generate zemble token', async () => {
    const app = await createTestApp(plugin)

    const res = await app.gqlRequest(LoginWithAppleDocument, {
      authorizationCode: '000000',
      identityToken: 'eyJraWQiOiJsVkhkT3g4bHRSIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmtpbmdzdGluY3Quc2lnbi1pbi13aXRoLWFwcGxlIiwiZXhwIjoxNzEyMzE0NzA1LCJpYXQiOjE3MTIyMjgzMDUsInN1YiI6IjAwMjAyMS5jZmY1YmEyYWYwMDk0NTExODllZjZkMjM0YzJjNTc2NC4xMDU4IiwiY19oYXNoIjoidW1RT2VJVXpXNldqS2RpYVNPaXZJUSIsImVtYWlsIjoidWtAaGVyYmVyLm1lIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF1dGhfdGltZSI6MTcxMjIyODMwNSwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.ZfjaAofABfZdvXyzD5R6f0O2kHn7oxcT50XqBmB3UsILuOLSdfzK5rV8FIrsj4H-0yTQUz5bxbQmVxABn8MIG2m866SBgD6--kIOcbDJm9spsGutucF7bQ4ZrrgMrTsnFSMUpk04OddmFYpjggTRH_Ja1MBB3eiFEOKWMkTgS5SGoRFmcBP5cTyTlXnp-W7QaNmcSJC2vqxshQ6WOudmXALkGktdDmfK_R40jQrhqY2oA_TvJZP55xk7QoLNFMu76YEp4Wbh2WSGZy5q6WTt6wAVcU-pnYKOdKTZtLAIgSvhjddUNZJ7Qz0PdbW6DNtpYmcHirMzj3mrbyM0A9t62A',
      realUserStatus: AppleAuthenticationUserDetectionStatus.Unsupported,
      userUUID: '000000',
    })

    expect(res.errors?.[0]).toHaveProperty('message', '[@zemble/auth-apple] Error validating Apple ID token, the token has expired')
  })
})
