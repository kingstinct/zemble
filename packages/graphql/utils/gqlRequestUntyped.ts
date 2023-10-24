/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import { type GraphQLFormattedError } from 'graphql'

export async function gqlRequestUntyped<TRes, TVars>(
  app: Pick<Zemble.App, 'hono'>,
  query: string,
  variables: TVars,
  options?: {readonly headers?: Record<string, string>, readonly silenceErrors?: boolean},
) {
  const response = await app.hono.fetch(new Request('http://localhost/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  }))

  const { data, errors } = await response.json() as unknown as {
    readonly data?: TRes,
    readonly errors: readonly GraphQLFormattedError[]
  }

  if (errors && !options?.silenceErrors) {
    console.error(errors)
  }

  return { data, errors, response }
}

export default gqlRequestUntyped
