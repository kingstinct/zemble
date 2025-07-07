import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files'

import type { TypedPresetConfig } from '@eddeee888/gcg-typescript-resolver-files/src/validatePresetConfig'
import type { CodegenConfig } from '@graphql-codegen/cli'
import type { Types } from '@graphql-codegen/plugin-helpers'

export const DEFAULT_SCHEMA_INPUT: Types.InstanceOrArray<Types.Schema> = [
  `./**/*.graphql`,
  '!./graphql/client.generated/**/*',
  `!./node_modules/**/*`,
]
export const DEFAULT_CLIENT_OUTPUT_DIRECTORY_PATH =
  `./graphql/client.generated/` as const
export const DEFAULT_SERVER_OUTPUT_SCHEMA_PATH =
  `./graphql/schema.generated.ts` as const

export const createClientOutputConfig = () =>
  ({
    plugins: [
      {
        add: {
          placement: 'prepend',
          content: `// @ts-nocheck`,
        },
      },
    ],
    documents: [
      `./**/*.tsx`,
      `./**/*.ts`,
      `./*.tsx`,
      `./*.ts`,
      `!./**/*.generated.ts`,
      `!./node_modules/**/*`,
      `!./**/node_modules/**/*`,
    ],
    config: {
      useTypeImports: true,
    },
    preset: 'client',
  }) satisfies Types.ConfiguredOutput

export const createClientConfig = ({
  schemaInput = DEFAULT_SCHEMA_INPUT,
  outputPath = DEFAULT_CLIENT_OUTPUT_DIRECTORY_PATH,
}: {
  readonly schemaInput?: Types.InstanceOrArray<Types.Schema>
  readonly outputPath?: string
}) =>
  ({
    schema: schemaInput,
    ignoreNoDocuments: true,
    generates: {
      [outputPath]: createClientOutputConfig(),
    },
  }) satisfies CodegenConfig

const DEFAULT_SERVER_CONFIG = {
  useIndexSignature: true,
  contextType: 'Zemble.GraphQLContext',
  immutableTypes: true,
  directiveContextTypes: ['auth#Zemble.AuthContextWithToken'],
  showUnusedMappers: true,
  useTypeImports: true,
  maybeValue: 'T | null | undefined',
} satisfies Types.PluginConfig<unknown>

export const createServerOutputConfig = () =>
  ({
    config: DEFAULT_SERVER_CONFIG,
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
  }) as Types.ConfiguredOutput

const createServerOutputConfigWithResolverGeneration = (
  config?: TypedPresetConfig,
) =>
  ({
    ...defineConfig(
      {
        resolverRelativeTargetDir: '.',
        typeDefsFilePath: false,
        mode: 'merged',
        typesPluginsConfig: DEFAULT_SERVER_CONFIG,
        ...config,
      },
      {},
    ),
    hooks: {
      afterOneFileWrite: ['bunx biome check --fix --files-ignore-unknown=true'],
    },
  }) satisfies Types.ConfiguredOutput

export function createServerConfig<
  TOutputPath extends string = typeof DEFAULT_SERVER_OUTPUT_SCHEMA_PATH,
>({
  schema = DEFAULT_SCHEMA_INPUT,
  serverOutputSchemaPath: serverOutputSchemaPathOverride,
  resolverGeneration,
}: {
  readonly schema?: Types.InstanceOrArray<Types.Schema>
  readonly serverOutputSchemaPath?: TOutputPath
  readonly resolverGeneration?: TypedPresetConfig | boolean
}) {
  if (resolverGeneration === undefined) {
    resolverGeneration = !!(
      process.env['GENERATE'] && JSON.stringify(process.env['GENERATE'])
    )
  }

  const serverOutputSchemaPath =
    serverOutputSchemaPathOverride ?? DEFAULT_SERVER_OUTPUT_SCHEMA_PATH

  const pathToServerOutputSchemaPathas = serverOutputSchemaPath.split('/')
  pathToServerOutputSchemaPathas.pop()
  const pathToServerOutputSchemaPath = `${pathToServerOutputSchemaPathas.join('/')}/`

  return {
    schema,
    ignoreNoDocuments: true,
    generates: {
      ...(resolverGeneration === false
        ? {
            [serverOutputSchemaPath]: createServerOutputConfig(),
          }
        : {
            [pathToServerOutputSchemaPath]:
              createServerOutputConfigWithResolverGeneration(),
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
