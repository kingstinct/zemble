
import {createContext, useEffect, useMemo, useState} from 'react'
import { useMutation } from 'urql'
import {AuthProvider} from 'readapt-plugin-auth-expo/contexts/Auth'

import { graphql } from '../gql'

const Login = graphql(/* GraphQL */ `
  mutation Login {
    login
  }
`)

export const SimpleAnonymousAuthContext = createContext({
  login: () => {},
})

export const SimpleAnonymousAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)

  const [response, login] = useMutation(Login)
  
  useEffect(() => {
    const token = response.data?.login
    
    if (token) {
      setToken(token)
    }
  }, [response])

  return (
    <AuthProvider setToken={setToken} token={token}>
      <SimpleAnonymousAuthContext.Provider value={useMemo(() => ({
        login: () => {
          void login({})
        }
      }), [])}>
      {children}
      </SimpleAnonymousAuthContext.Provider>
    </AuthProvider>
  )
}

export default SimpleAnonymousAuthContext