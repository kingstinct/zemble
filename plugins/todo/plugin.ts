import { Plugin } from '@readapt/core'
import Yoga from '@readapt/graphql-yoga'
import anonymousAuth from 'readapt-plugin-anonymous-auth'

export default new Plugin(__dirname, {
  // this is mostly to ensure we get the global typings past here
  dependencies: () => [
    { plugin: Yoga },
    { plugin: anonymousAuth, devOnly: true },
  ],
})
