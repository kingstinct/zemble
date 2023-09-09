import { useContext } from 'react'

import AuthContext from '../contexts/Auth'

import type { PropsWithChildren } from 'react'

export const ShowForUnauthenticated: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useContext(AuthContext)
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return !token ? <>{children}</> : null
}

export default ShowForUnauthenticated
