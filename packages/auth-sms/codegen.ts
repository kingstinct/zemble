import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { DEFAULT_CLIENT_OUTPUT_DIRECTORY_PATH } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config = {
  generates: {
    [DEFAULT_CLIENT_OUTPUT_DIRECTORY_PATH]: {
      config: {
        mappers: {
          User: '@zemble/core/types#TokenContents',
        },
      },
    },
  },
} satisfies CodegenConfig

export default mergeDeep(defaultConfig, config)
