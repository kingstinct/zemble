import { AuthContext, useDecodedToken } from '@kingstinct/react'
import { router } from 'expo-router'
import { useCallback, useContext } from 'react'
import { View, Button } from 'react-native'

const ProfileScreen = () => {
  const { clearToken, token } = useContext(AuthContext)

  const logout = useCallback(() => {
    clearToken()
    router.replace('/login')
  }, [clearToken])

  const decodedToken = useDecodedToken(token)

  return (
    <View>
      { JSON.stringify(decodedToken, null, 2) }
      <Button
        onPress={logout}
        title='Logout'
      />
    </View>
  )
}

export default ProfileScreen
