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
        directiveContextTypes: ['auth#Readapt.AuthContextWithToken'],
        showUnusedMappers: true,
      },
      plugins: [
        {
          add: {
            placement: 'prepend',
            content: `// @ts-nocheck`,
          },
        },
        'typescript',
        'typescript-resolvers',
      ],
    },
    [`./graphql/client.generated/`]: {
      documents: [
        `./**/*.tsx`,
        `./**/*.ts`,
        `./*.tsx`,
        `./*.ts`,
        `!./**/*.generated.ts`,
        `!./node_modules/**/*`,
      ],
      plugins: [
        {
          add: {
            placement: 'prepend',
            content: `// @ts-nocheck`,
          },
        },
      ],
      preset: 'client',
    },
  },
} satisfies CodegenConfig

export default config
