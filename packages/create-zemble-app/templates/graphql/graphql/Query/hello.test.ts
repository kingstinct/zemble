import { it, expect } from 'bun:test'

import createApp from '../../app'
import { graphql } from '../client.generated'

const HelloWorldQuery = graphql(`
  query Hello {
    hello
  }
`)

it('Should return world!', async () => {
  const app = await createApp

  const response = await app.gqlRequest(HelloWorldQuery, {})

  expect(response.data).toEqual({
    hello: 'world!',
  })
})
