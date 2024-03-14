import { createServerConfig } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const defaultConfig = createServerConfig({ resolverGeneration: true })

const config: CodegenConfig = {
  ...defaultConfig,
}

export default config
