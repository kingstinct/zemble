/* eslint-disable react-hooks/rules-of-hooks */
import { OneOfInputObjectsRule, useExtendedValidation } from '@envelop/extended-validation'
import { Plugin } from '@readapt/core'
import graphqlYoga from '@readapt/graphql-yoga'
import kvPlugin from 'readapt-plugin-kv'

import { connect } from './clients/papr'
import getDynamicSchema from './getDynamicSchema'

import type { DependenciesResolver } from '@readapt/core'

interface CmsConfig extends Readapt.GlobalConfig {

}

const defaultConfig = {

} satisfies CmsConfig

const plugin = new Plugin(__dirname, {
  dependencies: () => {
    const deps: DependenciesResolver<readonly Readapt.GlobalConfig[]> = [
      {
        plugin: graphqlYoga.configure({
          extendSchema: async () => Promise.all([getDynamicSchema()]),
          yoga: {
            plugins: [
              useExtendedValidation({
                rules: [OneOfInputObjectsRule],
              }),
            ],
          },
        }),
      },
      {
        plugin: kvPlugin,
      },
    ]

    return deps
  },
  defaultConfig,
})

export default plugin
