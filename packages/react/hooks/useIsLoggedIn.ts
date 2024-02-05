import { useContext } from 'react'

import { AuthContext } from '../contexts/Auth'

export const useIsLoggedIn = () => {
  const { hasToken } = useContext(AuthContext)

  return hasToken
}

export default useIsLoggedIn
