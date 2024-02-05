import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import React, {
  useEffect, useMemo, useState, createContext, useContext,
} from 'react'

import type { PropsWithChildren } from 'react'

export enum Status {
  INITIALIZING,
  READY_WITH_TOKEN,
  READY_WITHOUT_TOKEN,
}

export type AuthContextData = {
  readonly token: string | null,
  readonly hasToken: boolean,
  readonly clearToken: () => void,
  readonly setToken: (token: string) => void
  readonly status: Status
}

export const AuthContext = createContext<AuthContextData>({
  clearToken: () => { },
  hasToken: false,
  setToken: () => { },
  token: null,
  status: Status.INITIALIZING,
})

const AUTH_TOKEN_KEY_DEFAULT = 'AUTH_TOKEN'

type AuthStateInternal = { readonly token: string | null, readonly isReady: boolean }

export const getToken = async (authTokenKey = AUTH_TOKEN_KEY_DEFAULT) => {
  const t = await AsyncStorage.getItem(authTokenKey)

  return t
}

export async function getDecodedToken<T = unknown>() {
  const t = await getToken()
  return t ? jwtDecode<T>(t) : null
}

const AuthProvider: React.FC<PropsWithChildren<{readonly authTokenKey?: string}>> = ({ children, authTokenKey = AUTH_TOKEN_KEY_DEFAULT }) => {
  const [{ token, isReady }, setToken] = useState<AuthStateInternal>({ token: null, isReady: false })

  useEffect(() => {
    const init = async () => {
      const t = await getToken()

      setToken({ token: t, isReady: true })
    }
    void init()
  }, [])

  const value = useMemo<AuthContextData>(() => ({
    clearToken: () => {
      setToken({ token: null, isReady: true })
      void AsyncStorage.removeItem(authTokenKey)
    },
    hasToken: !!token,
    setToken: (t: string) => {
      setToken({ token: t, isReady: true })
      void AsyncStorage.setItem(authTokenKey, t)
    },
    token,
    status: isReady ? (token ? Status.READY_WITH_TOKEN : Status.READY_WITHOUT_TOKEN) : Status.INITIALIZING,
  }), [token, isReady, authTokenKey])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useToken = () => {
  const { token } = useContext(AuthContext)

  return token
}

export const useStatus = () => {
  const { status } = useContext(AuthContext)

  return status
}

export const useSetToken = () => {
  const { setToken } = useContext(AuthContext)

  return setToken
}

export const useClearToken = () => {
  const { clearToken } = useContext(AuthContext)

  return clearToken
}

export default AuthProvider
