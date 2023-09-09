import defaultConfig from '@readapt/graphql-yoga/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  ...defaultConfig,
  generates: {
    ...defaultConfig.generates,
    /* seemed like a nice idea, but format is a bit fugly, and it seems to destroy stuff

    graphql: defineConfig({
      resolverRelativeTargetDir: '.',
      resolverGeneration: 'disabled',
      typeDefsFilePath: false,
      resolverTypesPath: 'schema.generated.ts',
      resolverMainFileMode: 'merged',
    }), */
  },
}

export default config
