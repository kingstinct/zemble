
import {createContext, useEffect, useMemo, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from 'urql'

import { graphql } from '../gql'

const Login = graphql(/* GraphQL */ `
  mutation Login {
    login
  }
`)

const TOKEN_KEY = 'auth-token'

export const AuthContext = createContext({
  token: null as string | null,
  login: () => {},
  logout: () => {},
})

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)

  const [response, login] = useMutation(Login)
  
  useEffect(() => {
    const token = response.data?.login
    
    if (token) {
      void AsyncStorage.setItem(TOKEN_KEY, token)
      setToken(token)
    }
  }, [response])

  console.log('RESPONSE', response)

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY)
      setToken(token)
    }
    getToken()
  }, [])

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={useMemo(() => ({ 
        token, 
        login: () => {
          void login({})
        }, 
        logout 
      }), [token])}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext