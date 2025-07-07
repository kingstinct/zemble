import { AuthContext } from '@zemble/react-auth'
import { useContext } from 'react'

export const useIsLoggedIn = () => {
  const { hasToken } = useContext(AuthContext)

  return hasToken
}

export default useIsLoggedIn
