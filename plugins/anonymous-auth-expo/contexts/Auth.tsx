import {
  createContext, useEffect, useMemo, useState,
} from 'react'
import { AuthProvider } from 'readapt-plugin-auth-expo/contexts/Auth'
import { useMutation } from 'urql'

import { graphql } from '../gql'

const Login = graphql(/* GraphQL */ `
  mutation Login($username: String!) {
    login(username: $username){
      token
    }
  }
`)

export const SimpleAnonymousAuthContext = createContext({
  login: () => {},
})

export const SimpleAnonymousAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)

  const [response, login] = useMutation(Login)

  useEffect(() => {
    const res = response.data?.login

    if (res?.token) {
      setToken(res.token)
    }
  }, [response])

  return (
    <AuthProvider setToken={setToken} token={token}>
      <SimpleAnonymousAuthContext.Provider value={useMemo(() => ({
        login: () => {
          void login({
            username: 'anonymous',
          })
        },
      }), [login])}
      >
        {children}
      </SimpleAnonymousAuthContext.Provider>
    </AuthProvider>
  )
}

export default SimpleAnonymousAuthContext
