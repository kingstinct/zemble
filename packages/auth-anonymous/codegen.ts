import defaultConfig, { DEFAULT_SERVER_OUTPUT_SCHEMA_PATH, createServerOutputConfig } from '@zemble/graphql/codegen'
import mergeDeep from '@zemble/utils/mergeDeep'

import type { CodegenConfig } from '@graphql-codegen/cli'

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
