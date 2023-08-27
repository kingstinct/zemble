import { PluginWithMiddleware } from '@readapt/core'

import middleware from './middleware'

import type { GraphQLMiddlewareConfig } from './middleware'

const defaultConfig = {
  yoga: {
    graphqlEndpoint: '/graphql',
  },
  redisUrl: process.env.REDIS_URL,
} satisfies GraphQLMiddlewareConfig

export default new PluginWithMiddleware<GraphQLMiddlewareConfig>(__dirname, middleware, { defaultConfig })
