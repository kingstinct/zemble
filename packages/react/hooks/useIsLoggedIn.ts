import { useContext } from 'react'

import { AuthContext } from '@zemble/react-auth'

export const useIsLoggedIn = () => {
  const { hasToken } = useContext(AuthContext)

  return hasToken
}

export default useIsLoggedIn
