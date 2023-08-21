
import {useContext} from 'react'
import {Button} from 'react-native'
import AuthContext from '../contexts/Auth';

const LoginButton = () => {
  const {token, login, logout} = useContext(AuthContext)

  return token 
    ? <Button title="Logout" onPress={logout} /> 
    :<Button title="Login" onPress={login} />
}

export default LoginButton