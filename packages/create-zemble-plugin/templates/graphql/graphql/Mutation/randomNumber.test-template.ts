import { expect, it } from 'bun:test'
import { createTestApp } from '@zemble/core/test-utils'

import plugin from '../../plugin'

// import from generated client // Replace with actual implementation

const randomNumberMutation = `
  mutation RandomNumber {
    randomNumber
  }
`

it('Should return a number', async () => {
  const app = await createTestApp(plugin)

  const response = await app.gqlRequestUntyped(randomNumberMutation, {})
  expect(response.data).toEqual({
    randomNumber: expect.any(Number),
  })
})
