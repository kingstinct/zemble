import { useContext } from 'react'
import { View } from 'react-native'

import AuthContext from '../contexts/Auth'

import type { PropsWithChildren } from 'react'

export const ShowForAuthenticated: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useContext(AuthContext)
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return token ? <View>{children}</View> : null
}
