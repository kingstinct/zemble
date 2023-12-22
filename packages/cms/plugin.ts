/* eslint-disable react-hooks/rules-of-hooks */
import { OneOfInputObjectsRule, useExtendedValidation } from '@envelop/extended-validation'
import { Plugin, PluginWithMiddleware } from '@zemble/core'
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

const plugin = new PluginWithMiddleware(__dirname,
  // eslint-disable-next-line unicorn/consistent-function-scoping
  () => async () => {
    await papr.connect()
  },
  {
    // @ts-expect-error fix later
    dependencies: () => {
      const deps: DependenciesResolver<readonly Zemble.GlobalConfig[]> = [
        {
          // @ts-expect-error fix later
          plugin: MongoDB,
        },
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

export default plugin
