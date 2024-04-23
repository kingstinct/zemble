import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { DEFAULT_SERVER_OUTPUT_SCHEMA_PATH, createServerOutputConfig } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const override = {
  generates: {
    [DEFAULT_SERVER_OUTPUT_SCHEMA_PATH]: {
      ...createServerOutputConfig(),
      config: {
        mappers: {
          Entity: '../types#EntitySchemaType',
        },
      },
    },
  },
} satisfies CodegenConfig

const config = mergeDeep(defaultConfig, override)

export default config
