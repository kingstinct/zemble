import type { PropsWithChildren } from 'react'
import { useContext } from 'react'
import { View } from 'react-native'
import AuthContext from '../contexts/Auth'

export const ShowForAuthenticated: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { token } = useContext(AuthContext)
  return token ? <View>{children}</View> : null
}
