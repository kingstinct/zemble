import type { CodegenConfig } from '@graphql-codegen/cli'

const config = {
  schema: `./graphql/schema.graphql`,
  ignoreNoDocuments: true,
  generates: {
    [`./graphql/schema.generated.ts`]: {
      config: {
        useIndexSignature: true,
        contextType: 'Readapt.GraphQLContext',
        immutableTypes: true,
        directiveContextTypes: ['skipAuth#Readapt.NoAuth'],
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
    [`./graphql/client.generated/`]: {
      documents: [
        `./**/*.tsx`,
        `./**/*.ts`,
        `!./**/*.generated.ts`,
        `!./node_modules/**/*`,
      ],
      preset: 'client',
    },
  },
} satisfies CodegenConfig

export default config
