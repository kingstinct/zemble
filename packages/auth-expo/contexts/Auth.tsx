import AsyncStorage from '@react-native-async-storage/async-storage'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useMemo } from 'react'
import { TOKEN_KEY } from '../config'
import getToken from '../utils/getToken'

export const AuthContext = createContext({
  token: null as string | null,
  logout: () => {},
})

export const ReadToken = async (): Promise<string | null> =>
  AsyncStorage.getItem(TOKEN_KEY)

type Props = {
  readonly token: string | null
  readonly setToken: (token: string | null) => void
}

export const AuthProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  token,
  setToken,
}) => {
  useEffect(() => {
    void getToken().then(setToken)
  }, [setToken])

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [setToken])

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          token,
          logout,
        }),
        [logout, token],
      )}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
