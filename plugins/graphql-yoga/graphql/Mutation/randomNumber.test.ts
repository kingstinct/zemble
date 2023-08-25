import plugin from "../../"
import { createClient, cacheExchange } from '@urql/core'

describe('Mutation.randomNumber', () => {

  it('Should return a number', async () => {
    const app = await plugin.pluginAsApp

    const req = new Request('http://localhost/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          mutation {
            randomNumber
          }
        `,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const response = await app.request(req)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      data: {
        randomNumber: expect.any(Number)
      }
    })
  })
})