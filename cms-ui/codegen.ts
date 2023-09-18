import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    '../plugins/cms/graphql/schema.graphql',
    '../plugins/cms-users/graphql/schema.graphql',
    '../plugins/auth-otp/graphql/schema.graphql',
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
