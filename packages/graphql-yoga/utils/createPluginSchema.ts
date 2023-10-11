import { createDefaultExecutor } from '@graphql-tools/delegate'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { defaultCreateProxyingResolver, wrapSchema } from '@graphql-tools/wrap'
import { readFileSync } from 'fs'
import { join } from 'path'

import readResolvers from './readResolvers'

import type { Subschema } from '@graphql-tools/delegate'
import type { GraphQLScalarType } from 'graphql'

export const createPluginSchema = async ({
  graphqlDir, transforms, scalars, skipGraphQLValidation,
}: {
  readonly graphqlDir: string;
  readonly transforms: Subschema['transforms'],
  readonly scalars: Record<string, GraphQLScalarType>,
  readonly skipGraphQLValidation: boolean,
}) => {
  const typeDefs = readFileSync(join(graphqlDir, '/schema.graphql'), 'utf8')

  const Query = await readResolvers(join(graphqlDir, '/Query'))

  const Mutation = await readResolvers(join(graphqlDir, '/Mutation'))
  const Subscription = await readResolvers(join(graphqlDir, '/Subscription'))

  const Type = await readResolvers(join(graphqlDir, '/Type'))

  const Scalars = await readResolvers(join(graphqlDir, '/Scalar'))

  const internalSchema = makeExecutableSchema<Readapt.GraphQLContext>({
    typeDefs,
    assumeValid: !!skipGraphQLValidation,
    resolvers: {
      ...(Object.keys(Query).length > 0 ? { Query } : {}),
      ...(Object.keys(Mutation).length > 0 ? { Mutation } : {}),
      ...(Object.keys(Subscription).length > 0 ? { Subscription } : {}),
      ...Type,
      ...Scalars,
      ...scalars,
    },
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
