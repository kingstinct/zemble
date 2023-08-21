import { Provider, errorExchange } from 'urql'
import { AuthProvider } from "./Auth"
import { PropsWithChildren } from 'react'

import { fetchExchange, createClient } from 'urql';

const urqlClient = createClient({
  url: 'http://robmax.local:3000/graphql',
  preferGetMethod: true,
  requestPolicy: 'network-only',
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/graphql-response+json, application/json, multipart/mixed, text/plain',
    }
  },
  exchanges: [
    errorExchange({
      onError: (e, operation) => {
        console.error('errorExchange', e, operation)
      },
    }),
    fetchExchange
  ],
});

const PluginProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <Provider value={urqlClient}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </Provider>
}

export default PluginProvider