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
export const defaultServerOutputRootPath = `./graphql/` as const

export const defaultServerGeneratedResolverTypesFilename = `schema.generated.ts` as const
export const defaultServerOutputPath = path.join(defaultServerOutputRootPath, defaultServerGeneratedResolverTypesFilename)

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

const defaultConfig = {
  useIndexSignature: true,
  contextType: 'Zemble.GraphQLContext',
  immutableTypes: true,
  directiveContextTypes: ['auth#Zemble.AuthContextWithToken'],
  showUnusedMappers: true,
  useTypeImports: true,
}

export function createServerConfig<TOutputPath extends string = typeof defaultServerOutputRootPath, TOutputFilename extends string = typeof defaultServerGeneratedResolverTypesFilename>({
  schema = defaultSchema,
  outputPath,
  generatedFileName,
  resolverGeneration,
}: {
  readonly schema?: Types.InstanceOrArray<Types.Schema>,
  readonly outputPath?: TOutputPath,
  readonly generatedFileName?: TOutputFilename,
  readonly resolverGeneration?: TypedPresetConfig | boolean
}) {
  if (resolverGeneration === undefined) {
    // eslint-disable-next-line no-param-reassign
    resolverGeneration = !!(process.env.GENERATE && JSON.stringify(process.env.GENERATE))
  }

  const output = outputPath ?? defaultServerOutputRootPath
  const resolversTypeFilename = generatedFileName ?? defaultServerGeneratedResolverTypesFilename

  return {
    schema,
    ignoreNoDocuments: true,
    generates: {
      ...(resolverGeneration === false ? {
        [path.join(output, resolversTypeFilename)]: {
          config: defaultConfig,
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
      } : {
        [output]: {
          ...defineConfig({
            resolverRelativeTargetDir: '.',
            typeDefsFilePath: false,
            mode: 'merged',
            typesPluginsConfig: defaultConfig,
            resolverTypesPath: resolversTypeFilename,
            ...resolverGeneration === true ? {} : resolverGeneration,
          }, {

          }),
          hooks: {
            afterOneFileWrite: ['eslint --fix'],
          },
        },
      }),
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
