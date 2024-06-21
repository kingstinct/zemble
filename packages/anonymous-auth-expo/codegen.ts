import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: ['../auth/graphql/schema.graphql', '../auth-anonymous/graphql/schema.graphql'],
  documents: ['contexts/**/*.tsx', 'components/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './gql.generated/': {
      preset: 'client',
    },
  },
}

export default config
