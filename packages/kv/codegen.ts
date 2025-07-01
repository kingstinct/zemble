import type { CodegenConfig } from '@graphql-codegen/cli'
import { createServerConfig } from '@zemble/graphql/codegen'

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
