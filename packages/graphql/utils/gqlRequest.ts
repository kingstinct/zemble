/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import zembleContext from '@zemble/core/zembleContext'
import { type GraphQLFormattedError } from 'graphql'
import { print } from 'graphql/language/printer'

import type { TypedDocumentNode, ResultOf } from '@graphql-typed-document-node/core'

export async function gqlRequest<TQuery, TVars>(
  app: Pick<Zemble.App, 'hono'>,
  query: TypedDocumentNode<TQuery, TVars>,
  variables: TVars,
  options: {readonly headers?: Record<string, string>, readonly silenceErrors?: boolean} = {},
) {
  const response = new Request('http://localhost/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const res = await app.hono.fetch(response)

  const { errors, data } = await res.json() as unknown as {
    readonly data?: ResultOf<TQuery>,
    readonly errors: readonly GraphQLFormattedError[]
  }

  if (errors && !options?.silenceErrors) {
    zembleContext.logger.error(errors)
  }

  return { errors, data, response }
}

export default gqlRequest
