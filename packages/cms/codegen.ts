import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { defaultServerOutputPath } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const override: CodegenConfig = {
  generates: {
    [defaultServerOutputPath]: {
      config: {
        mappers: {
          Entity: '../types#EntitySchemaType',
        },
      },
    },
  },
}

const config = mergeDeep<CodegenConfig>(defaultConfig, override)

export default config
