import { useContext } from 'react'
import { Button } from 'react-native'

import AuthContext from '../contexts/Auth'

const LoginButton = () => {
  const { login } = useContext(AuthContext)

  return <Button title='Login' onPress={login} />
}

export default LoginButton
