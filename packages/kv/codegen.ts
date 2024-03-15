import { createServerConfig } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const defaultConfig = createServerConfig({
  resolverGeneration: false,
})

const config: CodegenConfig = {
  ...defaultConfig,
  generates: {
    ...defaultConfig.generates,
  },
}

export default config
