/* eslint-disable @typescript-eslint/no-namespace */

import Auth from '@zemble/auth'
import { Plugin } from '@zemble/core'

declare global {
  namespace Zemble {
    interface TokenRegistry {
      readonly AnonymousAuth: {
        readonly type: 'AnonymousAuth',
        readonly userId: string,
        readonly username: string
      }
    }
  }
}

const plugin = new Plugin(import.meta.dir, {
  dependencies: () => [
    {
      plugin: Auth,
    },
  ],
})

export default plugin
