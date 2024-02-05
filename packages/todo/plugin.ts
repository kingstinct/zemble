import { Plugin } from '@zemble/core'
import Yoga from '@zemble/graphql'
import AnonymousAuth from 'zemble-plugin-auth-anonymous'
import KV from 'zemble-plugin-kv'

export default new Plugin(import.meta.dir, {
  // this is mostly to ensure we get the global typings past here
  dependencies: () => [
    { plugin: Yoga },
    { plugin: AnonymousAuth, onlyWhenRunningLocally: true },
    { plugin: KV },
  ],
})
