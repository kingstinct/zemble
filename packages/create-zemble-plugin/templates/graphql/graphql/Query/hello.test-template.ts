import { expect, it } from 'bun:test'
import { createTestApp } from '@zemble/core/test-utils'

import plugin from '../../plugin'

// import from generated client // Replace with actual implementation

const HelloWorldQuery = `
  query Hello {
    hello
  }
`

it('Should return world!', async () => {
  const app = await createTestApp(plugin)

  const response = await app.gqlRequestUntyped(HelloWorldQuery, {})

  expect(response.data).toEqual({
    hello: 'world!',
  })
})
