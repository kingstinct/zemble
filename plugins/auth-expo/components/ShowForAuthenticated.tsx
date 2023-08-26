import { useContext } from 'react'

import AuthContext from '../contexts/Auth'

import type { PropsWithChildren } from 'react'

export const ShowForAuthenticated: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useContext(AuthContext)
  return token ? <>{children}</> : null
}
