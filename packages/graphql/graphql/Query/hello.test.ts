import { expect, it } from 'bun:test'
import { createTestApp } from '@zemble/core/test-utils'

import plugin from '../../plugin'
import { graphql } from '../client-generated'

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
