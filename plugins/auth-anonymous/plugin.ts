/* eslint-disable @typescript-eslint/no-namespace */

import { Plugin } from '@readapt/core'
import Auth from 'readapt-plugin-auth'

declare global {
  namespace Readapt {
    interface TokenRegistry {
      readonly AnonymousAuth: {
        readonly userId: string,
        readonly username: string
      }
    }
  }
}

const plugin = new Plugin(__dirname, {
  dependencies: () => [
    {
      plugin: Auth,
    },
  ],
})

export default plugin
