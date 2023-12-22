import { createTestApp } from '@zemble/core'
import {
  it, expect, beforeAll, afterAll,
} from 'bun:test'

import plugin from '../../plugin'
import {
  signUpNewUser,
  deleteAllUsers,
  createSupabaseClient,
} from '../../test-utils'
import { graphql } from '../client.generated'

const randomNumberMutation = graphql(`
  mutation RandomNumber {
    randomNumber
  }
`)

beforeAll(async () => {
  await signUpNewUser()
})

afterAll(async () => {
  await deleteAllUsers()
})

it('Should return a number', async () => {
  const app = await createTestApp(plugin)

  const { data: { session } } = await createSupabaseClient().auth.getSession()

  const response = await app.gqlRequest(randomNumberMutation, {}, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  })
  expect(response.data).toEqual({
    // @ts-expect-error next release of bun might fix this?
    randomNumber: expect.any(Number),
  })
})

it('Should not accept a mumbo jumbo token', async () => {
  const app = await createTestApp(plugin)

  const response = await app.gqlRequest(randomNumberMutation, {}, {
    headers: {
      Authorization: `Bearer mumbo-jumbo`,
    },
  })

  expect(response.data).toBeUndefined()
  expect(response.errors).toEqual([
    {
      message: 'Authentication failed',
    },
  ])
})

it('Should require token', async () => {
  const app = await createTestApp(plugin)

  const response = await app.gqlRequest(randomNumberMutation, {})

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([
    {
      message: 'Accessing \'Mutation.randomNumber\' requires authentication.',
    },
  ])
})
