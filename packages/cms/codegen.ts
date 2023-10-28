import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { defaultServerOutputPath } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'
import type { PartialDeep } from 'type-fest'

const override = {
  generates: {
    [defaultServerOutputPath]: {
      config: {
        mappers: {
          Entity: '../types#EntitySchemaType',
        },
      },
    },
  },
} satisfies PartialDeep<CodegenConfig>

const config = mergeDeep<CodegenConfig>(defaultConfig, override)

export default config
