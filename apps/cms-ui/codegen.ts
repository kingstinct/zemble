import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    '../../packages/cms/graphql/schema.graphql',
    '../../packages/cms-users/graphql/schema.graphql',
    '../../packages/auth-otp/graphql/schema.graphql',
  ],
  documents: ['./components/**/*.tsx', './app/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './gql/': {
      preset: 'client',
    },
  },
}

export default config
