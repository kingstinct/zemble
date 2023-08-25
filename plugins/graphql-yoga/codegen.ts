import type { CodegenConfig } from '@graphql-codegen/cli';
 
const config = {
  schema: 'graphql/schema.graphql',
  documents: [
    './**/*.tsx',
    './**/*.ts'
  ],
  ignoreNoDocuments: true,
  generates: {
    './graphql/schema.generated.ts': {
      config: {
        useIndexSignature: true,
        contextType: 'Readapt.GraphQLContext',
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
    './gql/': {
      preset: 'client'  
    }
  },
} satisfies CodegenConfig;

export default config;