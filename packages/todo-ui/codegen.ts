import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../todo/graphql/schema.graphql',
  documents: ['./components/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './gql.generated/': {
      preset: 'client',
    },
  },
}

export default config
