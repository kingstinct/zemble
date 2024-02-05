import React, {
  useMemo, createContext, useContext, useState,
} from 'react'
import { Provider } from 'urql'

import { AuthContext } from './Auth'

import type { GraphQLError, GraphQLErrorExtensions } from 'graphql'
import type { PropsWithChildren } from 'react'
import type { CombinedError, Client, Operation } from 'urql'

const DEFAULT_VALUE = {
  reloadClient: () => {},
}

export const UrqlContext = createContext(DEFAULT_VALUE)

export type CreateUrqlClient<T extends GraphQLErrorExtensions = GraphQLErrorExtensions> = (opts: {
  readonly token: string | null,
  readonly onError: (error: CombinedErrorWithExtensions<T>, operation: Operation) => void,
  readonly clearToken: () => void,
}) => Client

export type UrqlProviderProps<T extends GraphQLErrorExtensions> = PropsWithChildren<{
  readonly onError: (error: CombinedErrorWithExtensions<T>, operation: Operation) => void,
  readonly createClient: CreateUrqlClient<T>,
}>

export type CustomGraphQLError<T extends GraphQLErrorExtensions = GraphQLErrorExtensions> = Omit<GraphQLError, 'extensions'> & {
  readonly extensions: T
}

export type CombinedErrorWithExtensions<T extends GraphQLErrorExtensions = GraphQLErrorExtensions> = Omit<CombinedError, 'graphQLErrors'> & {
  readonly graphQLErrors: readonly CustomGraphQLError<T>[];
}

function UrqlProvider<T extends GraphQLErrorExtensions>({ children, createClient, onError }: UrqlProviderProps<T>) {
  const { token, clearToken } = useContext(AuthContext)
  const [reloadClientAt, setReloadClientAt] = useState(Date.now())

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const client = useMemo(() => createClient({ token, clearToken, onError }), [
    token, clearToken, onError, createClient, reloadClientAt,
  ])

  const value = useMemo(() => ({
    reloadClient: () => setReloadClientAt(Date.now()),
  }), [])

  return (
    <UrqlContext.Provider value={value}>
      <Provider value={client}>
        {children}
      </Provider>
    </UrqlContext.Provider>
  )
}

export default UrqlProvider
