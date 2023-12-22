import { createTestApp } from '@zemble/core'
import { it, expect } from 'bun:test'

import plugin from '../../plugin'
import { graphql } from '../client.generated'

const HelloWorldQuery = graphql(`
  query Hello {
    hello
  }
`)

it('Should return world!', async () => {
  const app = await createTestApp(plugin)

  const response = await app.gqlRequest(HelloWorldQuery, {})

  expect(response.data).toEqual({
    hello: 'world!',
  })
})
