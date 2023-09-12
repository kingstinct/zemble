import { wrapSchema } from '@graphql-tools/wrap'
import { readFileSync } from 'fs'
import { createSchema } from 'graphql-yoga'
import { join } from 'path'

import readResolvers from './readResolvers'

import type { Subschema } from '@graphql-tools/delegate'
import type { GraphQLScalarType } from 'graphql'

export const createPluginSchema = async ({ graphqlDir, transforms, scalars }: {
  readonly graphqlDir: string;
  readonly transforms: Subschema['transforms'],
  readonly scalars: Record<string, GraphQLScalarType>
}) => {
  const typeDefs = readFileSync(join(graphqlDir, '/schema.graphql'), 'utf8')

  const Query = await readResolvers(join(graphqlDir, '/Query'))

  const Mutation = await readResolvers(join(graphqlDir, '/Mutation'))
  const Subscription = await readResolvers(join(graphqlDir, '/Subscription'))

  const Type = await readResolvers(join(graphqlDir, '/Type'))

  const Scalars = await readResolvers(join(graphqlDir, '/Scalar'))

  const schema = wrapSchema({
    schema: createSchema<Readapt.GraphQLContext>({
      typeDefs,
      resolvers: {
        ...(Object.keys(Query).length > 0 ? { Query } : {}),
        ...(Object.keys(Mutation).length > 0 ? { Mutation } : {}),
        ...(Object.keys(Subscription).length > 0 ? { Subscription } : {}),
        ...Type,
        ...Scalars,
        ...scalars,
      },
    }),
    transforms,
  })

  return schema
}

export default createPluginSchema
