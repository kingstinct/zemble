import { createDefaultExecutor } from '@graphql-tools/delegate'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { mergeResolvers } from '@graphql-tools/merge'
import { addResolversToSchema } from '@graphql-tools/schema'
import { defaultCreateProxyingResolver, wrapSchema } from '@graphql-tools/wrap'
import { join } from 'node:path'

import readResolvers from './readResolvers'

import type { Subschema } from '@graphql-tools/delegate'
import type { IStandardLogger } from '@zemble/core'
import type { GraphQLScalarType } from 'graphql'

export const createPluginSchema = async ({
  graphqlDir, transforms, scalars, skipGraphQLValidation, logger,
}: {
  readonly graphqlDir: string;
  readonly transforms: Subschema['transforms'],
  readonly scalars: Record<string, GraphQLScalarType>,
  readonly skipGraphQLValidation: boolean,
  readonly logger: IStandardLogger,
}) => {
  const [
    Query,
    Mutation,
    Subscription,
    Type,
    Scalars,
  ] = await Promise.all([
    readResolvers(join(graphqlDir, '/Query'), logger),
    readResolvers(join(graphqlDir, '/Mutation'), logger),
    readResolvers(join(graphqlDir, '/Subscription'), logger),
    readResolvers(join(graphqlDir, '/Type'), logger),
    readResolvers(join(graphqlDir, '/Scalar'), logger),
  ])

  const graphqlGlob = join(graphqlDir, './**/*.graphql')

  const schemaWithoutResolvers = await loadSchema(graphqlGlob, {
    loaders: [new GraphQLFileLoader()],
    assumeValid: !!skipGraphQLValidation,
  })

  const internalSchema = addResolversToSchema({
    schema: schemaWithoutResolvers,
    resolvers: mergeResolvers([
      Object.keys(Query).length > 0 ? { Query } : {},
      Object.keys(Mutation).length > 0 ? { Mutation } : {},
      Object.keys(Subscription).length > 0 ? { Subscription } : {},
      Type,
      Scalars,
      scalars,
    ]),
  })

  // todo [>1]: fix wrapping to work with aliases, something is missing here
  const schema = transforms.length > 0 ? wrapSchema({
    schema: internalSchema,
    executor: createDefaultExecutor(internalSchema),
    createProxyingResolver: defaultCreateProxyingResolver,
    transforms,
  }) : internalSchema

  return schema
}

export default createPluginSchema
