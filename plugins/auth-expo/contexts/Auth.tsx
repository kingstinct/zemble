
import {createContext, useCallback, useEffect, useMemo} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from '../config';
import getToken from '../utils/getToken';

export const AuthContext = createContext({
  token: null as string | null,
  logout: () => {},
})

export const ReadToken = (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY)
}

export const AuthProvider: React.FC<React.PropsWithChildren<{ token: string | null, setToken:  (token: string | null) => void }>> = ({ children, token, setToken }) => {
  useEffect(() => {
    getToken().then(setToken)
  }, [])

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={useMemo(() => ({ 
        token, 
        logout
      }), [token])}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext