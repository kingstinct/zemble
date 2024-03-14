import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files'
import path from 'node:path'

import type { TypedPresetConfig } from '@eddeee888/gcg-typescript-resolver-files/src/validatePresetConfig'
import type { CodegenConfig } from '@graphql-codegen/cli'
import type { Types } from '@graphql-codegen/plugin-helpers'

const defaultSchema: Types.InstanceOrArray<Types.Schema> = [
  `./graphql/**/*.graphql`,
  '!./graphql/client.generated/**/*',
]
export const defaultClientOutputPath = `./graphql/client.generated/` as const
export const defaultServerOutputPath = `.` as const
export const defaultServerGeneratedFileName = `schema.generated.ts` as const

export const createClientConfig = ({
  schema = defaultSchema,
  outputPath = defaultClientOutputPath,
}: { readonly schema?: Types.InstanceOrArray<Types.Schema>, readonly outputPath?: string }) => ({
  schema,
  ignoreNoDocuments: true,
  generates: {
    [outputPath]: {
      documents: [
        `./**/*.tsx`,
        `./**/*.ts`,
        `./*.tsx`,
        `./*.ts`,
        `!./**/*.generated.ts`,
        `!./node_modules/**/*`,
      ],
      config: {
        useTypeImports: true,
      },
      preset: 'client',
    },
  },
}) satisfies CodegenConfig

export function createServerConfig<TOutputPath extends string = typeof defaultServerOutputPath, TOutputFilename extends string = typeof defaultServerGeneratedFileName>({
  schema = defaultSchema,
  outputPath,
  generatedFileName,
  resolverGeneration = false,
}: {
  readonly schema?: Types.InstanceOrArray<Types.Schema>,
  readonly outputPath?: TOutputPath,
  readonly generatedFileName?: TOutputFilename,
  readonly resolverGeneration?: TypedPresetConfig | boolean
}) {
  const output = outputPath ?? defaultServerOutputPath
  const filename = generatedFileName ?? defaultServerGeneratedFileName

  return {
    schema,
    ignoreNoDocuments: true,
    generates: {
      ...(resolverGeneration === false ? {} : {
        [output]: defineConfig({
          resolverRelativeTargetDir: '.',
          ...resolverGeneration === true ? {} : resolverGeneration,
        }),
      }),
      [path.join(output + filename)]: {
        config: {
          useIndexSignature: true,
          contextType: 'Zemble.GraphQLContext',
          immutableTypes: true,
          directiveContextTypes: ['auth#Zemble.AuthContextWithToken'],
          showUnusedMappers: true,
          useTypeImports: true,
        },
        plugins: [
          {
            add: {
              placement: 'prepend',
              content: `// @ts-nocheck
import '@zemble/core'`,
            },
          },
          'typescript',
          'typescript-resolvers',
        ],
      },
    },
  } satisfies CodegenConfig
}

const serverConfig = createServerConfig({})
const clientConfig = createClientConfig({})

const config = {
  ...serverConfig,
  ...clientConfig,
  generates: {
    ...serverConfig.generates,
    ...clientConfig.generates,
  },
} satisfies CodegenConfig

export default config
