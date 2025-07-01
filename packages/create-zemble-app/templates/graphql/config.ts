import { type Configure } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'

const config: Configure = {
  plugins: [GraphQL, Routes],
}

export default config
