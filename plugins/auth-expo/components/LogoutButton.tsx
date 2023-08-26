import { useContext } from 'react'
import { Button } from 'react-native'

import AuthContext from '../contexts/Auth'

export const LogoutButton = ({ title }: { readonly title?: string }) => {
  const { logout } = useContext(AuthContext)

  return <Button title={title ?? 'Logout'} onPress={logout} />
}

export default LogoutButton
