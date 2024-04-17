/* eslint-disable @typescript-eslint/no-namespace */

import { Plugin } from '@zemble/core'
import Auth from 'zemble-plugin-auth'

declare global {
  namespace Zemble {
    interface TokenRegistry {
      readonly AnonymousAuth: {
        readonly type: 'AnonymousAuth',
        readonly userId: string,
      }
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
