import plugin from "../../"
import { graphql } from '../../gql'
 
const randomNumberMutation = graphql(`
  mutation RandomNumber {
    randomNumber
  }
`)

describe('Mutation.randomNumber', () => {
  it('Should return a number', async () => {
    const app = await plugin.pluginAsApp()
    
    const response = await app.gqlRequest(randomNumberMutation, {})
    expect(response).toEqual({
      data: {
        randomNumber: expect.any(Number)
      }
    })
  })
})