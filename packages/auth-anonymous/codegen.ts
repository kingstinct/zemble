import type { CodegenConfig } from '@graphql-codegen/cli'
import defaultConfig, { createServerOutputConfig, DEFAULT_SERVER_OUTPUT_SCHEMA_PATH } from '@zemble/graphql/codegen'
import mergeDeep from '@zemble/utils/mergeDeep'

const config = {
  generates: {
    [DEFAULT_SERVER_OUTPUT_SCHEMA_PATH]: {
      ...createServerOutputConfig(),
      config: {
        mappers: {
          User: '@zemble/core/types#TokenContents',
        },
      },
    },
  },
} satisfies CodegenConfig

export default mergeDeep(config, defaultConfig)
