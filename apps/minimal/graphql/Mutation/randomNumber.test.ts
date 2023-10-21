import {
  it, expect,
} from 'bun:test'

import appPromise from '../../app'
import { graphql } from '../client.generated'

const randomNumberMutation = graphql(`
  mutation RandomNumber {
    randomNumber
  }
`)

it('Should return a number', async () => {
  const app = await appPromise

  const response = await app.gqlRequest(randomNumberMutation, {})
  expect(response.data).toEqual({
    // @ts-expect-error next release of bun might fix this?
    randomNumber: expect.any(Number),
  })
})
