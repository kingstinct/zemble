import { expect, it } from 'bun:test'
import { createTestApp } from '@zemble/core/test-utils'

import plugin from '../../plugin'
import { graphql } from '../client.generated'

const randomNumberMutation = graphql(`
  mutation RandomNumber {
    randomNumber
  }
`)

it('Should return a number', async () => {
  const app = await createTestApp(plugin)

  const response = await app.gqlRequest(randomNumberMutation, {})
  expect(response.data).toEqual({
    randomNumber: expect.any(Number),
  })
})
