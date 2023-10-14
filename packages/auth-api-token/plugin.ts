import { Plugin } from '@zemble/core'
import GraphQLYoga from '@zemble/graphql'
import Auth from 'zemble-plugin-auth'

const API_KEY_SECRET = process.env.API_KEY_SECRET ?? 'top-secret'
const INVALIDATE_API_KEYS_IAT_BEFORE = process.env.INVALIDATE_API_KEYS_IAT_BEFORE ? parseInt(process.env.INVALIDATE_API_KEYS_IAT_BEFORE, 10) : 0

type AuthConfig = {
  readonly API_KEY_SECRET?: string;
  readonly INVALIDATE_API_KEYS_IAT_BEFORE?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface TokenRegistry {
      readonly AuthApiToken: {
        readonly type: 'AuthApiToken'
        readonly isAPIKey: true
      }
    }
  }
}

const defaultConfig = {
  API_KEY_SECRET,
  INVALIDATE_API_KEYS_IAT_BEFORE,
} satisfies AuthConfig

export default new Plugin<AuthConfig, typeof defaultConfig>(__dirname, {
  defaultConfig,
  dependencies: [
    {
      plugin: GraphQLYoga,
    },
    {
      plugin: Auth,
    },
  ],
})
