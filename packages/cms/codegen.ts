import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { DEFAULT_SERVER_OUTPUT_SCHEMA_PATH } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const override: CodegenConfig = {
  generates: {
    [DEFAULT_SERVER_OUTPUT_SCHEMA_PATH]: {
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
