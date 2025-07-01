import type { CodegenConfig } from '@graphql-codegen/cli'
import defaultConfig, { createServerOutputConfig, DEFAULT_SERVER_OUTPUT_SCHEMA_PATH } from '@zemble/graphql/codegen'
import mergeDeep from '@zemble/utils/mergeDeep'

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
