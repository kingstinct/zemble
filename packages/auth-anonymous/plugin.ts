/* eslint-disable @typescript-eslint/no-namespace */

import Auth from '@zemble/auth'
import { Plugin, type BaseToken } from '@zemble/core'

declare global {
  namespace Zemble {
    interface TokenRegistry {
      readonly AnonymousAuth: {
        readonly type: 'AnonymousAuth',
        readonly userId: string,
      } & BaseToken
    }
  }
}

interface AnonymousConfig extends Zemble.GlobalConfig {
  readonly generateTokenContents?: (userId: string) => Zemble.TokenRegistry[keyof Zemble.TokenRegistry],
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
