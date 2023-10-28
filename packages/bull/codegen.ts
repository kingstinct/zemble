import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { defaultServerOutputPath } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  generates: {
    [defaultServerOutputPath]: {
      config: {
        mappers: {
          BullJob: 'bullmq#Job',
          BullQueue: 'bullmq#Queue',
        },
      },
    },
  },
}

export default mergeDeep<CodegenConfig>(defaultConfig, config)
