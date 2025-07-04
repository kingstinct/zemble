import type { CodegenConfig } from '@graphql-codegen/cli'
import { createClientConfig, createServerConfig } from '@zemble/graphql/codegen'

const defaultServerConfig = createServerConfig({})
const defaultClientConfig = createClientConfig({})

const config: CodegenConfig = {
  ...defaultServerConfig,
  ...defaultClientConfig,
  generates: {
    ...defaultServerConfig.generates,
    ...defaultClientConfig.generates,
  },
}

export default config
