import { expect, it } from 'bun:test'
import { createApp } from '@zemble/core'

import config from '../../config'
import { graphql } from '../client-generated'

const randomNumberMutation = graphql(`
  mutation RandomNumber {
    randomNumber
  }
`)

it('Should return a number', async () => {
  const app = await createApp(config)

  const response = await app.gqlRequest(randomNumberMutation, {})
  expect(response.data).toEqual({
    randomNumber: expect.any(Number),
  })
})
