import {expect} from '@jest/globals';



import plugin from "../../"

import { graphql } from '../../gql'
 
const HelloWorldQuery = graphql(`
  query Hello {
    hello
  }
`)

describe('Query.hello', () => {
  it('Should return world!', async () => {
    const app = await plugin.pluginAsApp()
    
    const response = await app.gqlRequest(HelloWorldQuery, {})
    expect(response).toEqual({
      data: {
        hello: 'world!'
      }
    })
  })
})