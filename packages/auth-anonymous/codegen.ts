import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { defaultServerOutputPath } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  generates: {
    [defaultServerOutputPath]: {
      config: {
        mappers: {
          User: '@zemble/core/types#TokenContents',
        },
      },
    },
  },
}

export default mergeDeep(config, defaultConfig)
