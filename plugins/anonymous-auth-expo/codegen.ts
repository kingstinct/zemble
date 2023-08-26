import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../simple-anonymous-auth/graphql/schema.graphql',
  documents: ['contexts/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './graphql/client.generated/': {
      preset: 'client',
    },
  },
}

export default config
