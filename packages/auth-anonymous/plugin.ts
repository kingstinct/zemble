/* eslint-disable @typescript-eslint/no-namespace */

import Auth from '@zemble/auth'
import { Plugin } from '@zemble/core'

declare global {
  namespace Zemble {
    interface AnonymousAuthToken {
      readonly type: 'AnonymousAuth',
      readonly userId: string,
    }

    interface TokenRegistry {
      readonly AnonymousAuth: AnonymousAuthToken
    }
  }
}

interface AnonymousConfig extends Zemble.GlobalConfig {
  readonly generateTokenContents?: (userId: string) => Zemble.AnonymousAuthToken,
  readonly generateUserId?: () => string,
}

const defaultConfig = {
  generateTokenContents: (userId: string) => ({
    type: 'AnonymousAuth',
    userId,
    sub: userId,
  }),
  generateUserId: () => Math.random().toString(36).substring(7),
} satisfies AnonymousConfig

const plugin = new Plugin<AnonymousConfig, typeof defaultConfig>(import.meta.dir, {
  dependencies: () => [
    {
      plugin: Auth,
    },
  ],
  defaultConfig,
})

export default plugin
