import { expect, it } from 'bun:test'

import { graphql } from '../client-generated'

const HelloWorldQuery = graphql(`
  query Hello {
    hello
  }
`)

it('Should return world!', async () => {
  const appPromise = (await import('../../app')).default
  const app = await appPromise

  const response = await app.gqlRequest(HelloWorldQuery, {})

  expect(response.data).toEqual({
    hello: 'world!',
  })
})
