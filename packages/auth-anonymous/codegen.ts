import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { DEFAULT_SERVER_OUTPUT_SCHEMA_PATH } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  generates: {
    [DEFAULT_SERVER_OUTPUT_SCHEMA_PATH]: {
      config: {
        mappers: {
          User: '@zemble/core/types#TokenContents',
        },
      },
    },
  },
}

export default mergeDeep(config, defaultConfig)
