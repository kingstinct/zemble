import type { PropsWithChildren } from 'react'
import { useContext } from 'react'
import { View } from 'react-native'
import AuthContext from '../contexts/Auth'

export const ShowForAuthenticated: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { token } = useContext(AuthContext)
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return token ? <View>{children}</View> : null
}
