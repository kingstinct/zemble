/* eslint-disable react-hooks/rules-of-hooks */
import { OneOfInputObjectsRule, useExtendedValidation } from '@envelop/extended-validation'
import { Plugin } from '@readapt/core'
import graphqlYoga from '@readapt/graphql-yoga'
import auth from 'readapt-plugin-auth'

import papr from './clients/papr'
import createDynamicSchema from './dynamicSchema/createDynamicSchema'

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
          extendSchema: async () => Promise.all([createDynamicSchema()]),
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
        plugin: auth,
      },
    ]

    return deps
  },
  defaultConfig,
})

if (process.env.PLUGIN_DEV) {
  void papr.connect()
}

export default plugin
