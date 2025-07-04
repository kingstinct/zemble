// import { requestPolicyExchange } from '@urql/exchange-request-policy'
import {
  createClient,
  errorExchange,
  fetchExchange,
  subscriptionExchange,
} from '@urql/core'
import type {
  CombinedErrorWithExtensions,
  CreateUrqlClient,
} from '@zemble/react/contexts/Urql'
import { createClient as createWSClient } from 'graphql-ws'
import { Platform } from 'react-native'

const BACKEND_ROOT_URL =
  Platform.OS === 'web' ? 'http://localhost:3000' : 'http://robmax.local:3000'

export const CACHE_DATA_KEY = 'graphcache-data'
export const CACHE_METADATA_KEY = 'graphcache-metadata'

const createClientWithToken: CreateUrqlClient = ({
  token,
  onError,
  clearToken,
}) => {
  const endpointUrl = `${BACKEND_ROOT_URL}/graphql`

  const wsClient = createWSClient({
    url: endpointUrl.replace('http', 'ws'),
    connectionParams: {
      authorization: token ? `Bearer ${token}` : null,
    },
  })

  return createClient({
    url: endpointUrl,
    requestPolicy: 'cache-and-network',
    fetchOptions: () => ({
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    }),
    exchanges: [
      // dedupExchange,
      // requestPolicyExchange({
      //   /* config */
      // }),
      errorExchange({
        onError: (e, operation) => {
          const error = e as unknown as CombinedErrorWithExtensions
          onError(error, operation)
          if (error.graphQLErrors) {
            const authError = error.graphQLErrors.find(
              (e) =>
                e.extensions?.code === 'UNAUTHENTICATED' ||
                e.message.includes('requires authentication'),
            )

            if (authError) {
              clearToken()
            }
          }
        },
      }),
      fetchExchange,
      subscriptionExchange({
        forwardSubscription(request) {
          const input = { ...request, query: request.query || '' }
          return {
            subscribe(sink) {
              const unsubscribe = wsClient.subscribe(input, sink)
              return { unsubscribe }
            },
          }
        },
      }),
    ],
  })
}

export default createClientWithToken
