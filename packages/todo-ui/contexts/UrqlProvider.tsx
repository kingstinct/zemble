import AuthContext from '@zemble/auth-expo/contexts/Auth'
import type { PropsWithChildren } from 'react'
import { useContext, useMemo } from 'react'
import type { ClientOptions } from 'urql'
import { createClient, fetchExchange, Provider } from 'urql'
import { GRAPHQL_ENDPOINT } from '../config'

export const bearerTokenConfigTransformer = (config: ClientOptions, token: string | null): ClientOptions => ({
  ...config,
  fetchOptions: {
    ...config.fetchOptions,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
})

const createUrqlClient = (token: string | null, transformer: typeof bearerTokenConfigTransformer) =>
  createClient(
    transformer(
      {
        url: GRAPHQL_ENDPOINT,
        fetchOptions: {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/graphql-response+json, application/json, multipart/mixed, text/plain',
          },
        },
        exchanges: [fetchExchange],
      },
      token,
    ),
  )

const UrqlProvider: React.FC<PropsWithChildren<{ readonly configTransformer?: typeof bearerTokenConfigTransformer }>> = ({ children, configTransformer }) => {
  const { token } = useContext(AuthContext)
  const client = useMemo(() => createUrqlClient(token, configTransformer ?? bearerTokenConfigTransformer), [token, configTransformer])

  return <Provider value={client}>{children}</Provider>
}

export default UrqlProvider
