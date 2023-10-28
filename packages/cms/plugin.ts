/* eslint-disable react-hooks/rules-of-hooks */
import { OneOfInputObjectsRule, useExtendedValidation } from '@envelop/extended-validation'
import { Plugin } from '@zemble/core'
import graphqlYoga from '@zemble/graphql'
import MongoDB from '@zemble/mongodb'
import auth from 'zemble-plugin-auth'

import papr from './clients/papr'
import createDynamicSchema from './dynamicSchema/createDynamicSchema'

import type { DependenciesResolver } from '@zemble/core'

interface CmsConfig extends Zemble.GlobalConfig {

}

const defaultConfig = {

} satisfies CmsConfig

const plugin = new Plugin(__dirname, {
  dependencies: () => {
    const deps: DependenciesResolver<readonly Zemble.GlobalConfig[]> = [
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
      {
        plugin: MongoDB,
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
