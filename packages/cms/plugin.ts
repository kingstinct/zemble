/* eslint-disable react-hooks/rules-of-hooks */
import { OneOfInputObjectsRule, useExtendedValidation } from '@envelop/extended-validation'
import auth from '@zemble/auth'
import { Plugin } from '@zemble/core'
import graphqlYoga from '@zemble/graphql'
import MongoDB from '@zemble/mongodb'

import papr from './clients/papr'
import createDynamicSchema from './dynamicSchema/createDynamicSchema'

import type { DependenciesResolver } from '@zemble/core'

interface CmsConfig extends Zemble.GlobalConfig {

}

const defaultConfig = {

} satisfies CmsConfig

const plugin = new Plugin(import.meta.dir,
  {
    middleware: async ({ logger }) => {
      await papr.connect({ logger })
    },
    dependencies: ({ providers }) => {
      const deps: DependenciesResolver<readonly Zemble.GlobalConfig[]> = [
        {
          plugin: MongoDB,
        },
        {
          plugin: graphqlYoga.configure({
            extendSchema: async () => Promise.all([createDynamicSchema({ logger: providers.logger })]),
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
