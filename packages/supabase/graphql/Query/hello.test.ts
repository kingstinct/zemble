/* eslint-disable functional/immutable-data */

import { createTestApp } from '@zemble/core/test-utils'
import {
  it, expect, beforeAll, afterAll,
} from 'bun:test'

import plugin from '../../plugin'
import {
  createSupabaseClient,
  deleteAllUsers,
  signUpNewUser,
} from '../../test-utils'
import { graphql } from '../client.generated'

beforeAll(async () => {
  await signUpNewUser()
})

afterAll(async () => {
  await deleteAllUsers()
})

const HelloWorldQuery = graphql(`
  query Hello {
    hello
  }
`)

it('Should return world!', async () => {
  const { data: { session } } = await createSupabaseClient().auth.getSession()

  const app = await createTestApp(plugin)

  const response = await app.gqlRequest(HelloWorldQuery, { }, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  })

  expect(response.data).toEqual({
    hello: 'world!',
  })
})
