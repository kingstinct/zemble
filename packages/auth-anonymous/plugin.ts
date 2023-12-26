/* eslint-disable @typescript-eslint/no-namespace */

import { Plugin } from '@zemble/core'
import Auth from 'zemble-plugin-auth'

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
