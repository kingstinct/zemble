import { expect, it } from 'bun:test'

import { graphql } from '../client-generated'

const randomNumberMutation = graphql(`
  mutation RandomNumber {
    randomNumber
  }
`)

it('Should return a number', async () => {
  const appPromise = (await import('../../app')).default
  const app = await appPromise

  const response = await app.gqlRequest(randomNumberMutation, {})
  expect(response.data).toEqual({
    randomNumber: expect.any(Number),
  })
})
