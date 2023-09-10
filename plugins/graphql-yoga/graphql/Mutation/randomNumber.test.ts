import plugin from '../../plugin'
import { graphql } from '../client.generated'

const randomNumberMutation = graphql(`
  mutation RandomNumber {
    randomNumber
  }
`)

describe('Mutation.randomNumber', () => {
  it('Should return a number', async () => {
    const { app } = await plugin.devApp()

    const response = await app.gqlRequest(randomNumberMutation, {})
    expect(response).toEqual({
      data: {
        randomNumber: expect.any(Number),
      },
    })
  })
})
