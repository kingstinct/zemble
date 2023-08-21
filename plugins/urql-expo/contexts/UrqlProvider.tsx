import { ClientOptions, Provider, errorExchange } from 'urql'
import { PropsWithChildren, useContext, useMemo } from 'react'
import AuthContext from 'readapt-plugin-auth-expo/contexts/Auth'
import { GRAPHQL_ENDPOINT } from '../config'

import { fetchExchange, createClient } from 'urql';

export const bearerTokenConfigTransformer = (config: ClientOptions, token: string | null): ClientOptions => {
  return {
    ...config, 
    fetchOptions: {
      ...config.fetchOptions,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
  }
}

const createUrqlClient = (token: string | null, transformer: typeof bearerTokenConfigTransformer) => createClient(transformer({
  url: GRAPHQL_ENDPOINT,
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/graphql-response+json, application/json, multipart/mixed, text/plain',
    }
  },
  exchanges: [
    fetchExchange
  ],
}, token));

const UrqlProvider: React.FC<PropsWithChildren<{configTransformer?: typeof bearerTokenConfigTransformer}>> = ({ children, configTransformer }) => {
  const { token } = useContext(AuthContext)
  const client = useMemo(() => createUrqlClient(token, configTransformer ?? bearerTokenConfigTransformer), [token])

  return <Provider value={client}>
      {children}
  </Provider>
}

export default UrqlProvider