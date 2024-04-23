import AnonymousAuth from '@zemble/auth-anonymous'
import { Plugin } from '@zemble/core'
import Yoga from '@zemble/graphql'
import KV from '@zemble/kv'

export default new Plugin(import.meta.dir, {
  // this is mostly to ensure we get the global typings past here
  dependencies: () => [
    { plugin: Yoga },
    { plugin: AnonymousAuth },
    { plugin: KV },
  ],
})
