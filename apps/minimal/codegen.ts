import { createClientConfig, createServerConfig } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const defaultServerConfig = createServerConfig({ })
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
