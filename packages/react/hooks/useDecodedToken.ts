import jwtDecode from 'jwt-decode'
import { useMemo } from 'react'

export function useDecodedToken<T>(token: string | null | undefined) {
  return useMemo(() => (token ? jwtDecode(token) as T : null), [token])
}

export default useDecodedToken
