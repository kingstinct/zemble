import { AuthProvider } from '@zemble/auth-expo/contexts/Auth'
import {
  createContext, useEffect, useMemo, useState,
} from 'react'
import { useMutation } from 'urql'

import { graphql } from '../gql.generated'

const Login = graphql(/* GraphQL */ `
  mutation Login {
    loginAnonymous {
      bearerToken
    }
  }
`)

export const SimpleAnonymousAuthContext = createContext({
  login: () => { },
})

export const SimpleAnonymousAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)

  const [response, login] = useMutation(Login)

  useEffect(() => {
    const res = response.data?.loginAnonymous

    if (res?.bearerToken) {
      setToken(res.bearerToken)
    }
  }, [response])

  return (
    <AuthProvider setToken={setToken} token={token}>
      <SimpleAnonymousAuthContext.Provider value={useMemo(() => ({
        login: () => {
          void login({})
        },
      }), [login])}
      >
        {children}
      </SimpleAnonymousAuthContext.Provider>
    </AuthProvider>
  )
}

export default SimpleAnonymousAuthContext
