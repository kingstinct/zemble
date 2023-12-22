import {
  it, expect,
} from 'bun:test'

import plugin from '../../plugin'
import { graphql } from '../client.generated'

const randomNumberMutation = graphql(`
  mutation RandomNumber {
    randomNumber
  }
`)

it('Should return a number', async () => {
  const app = await plugin.testApp()

  const response = await app.gqlRequest(randomNumberMutation, {})
  expect(response.data).toEqual({

    randomNumber: expect.any(Number),
  })
})
