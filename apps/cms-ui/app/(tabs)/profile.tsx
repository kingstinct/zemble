import { AuthContext, useDecodedToken } from '@kingstinct/react'
import { router } from 'expo-router'
import { useCallback, useContext } from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'

const ProfileScreen = () => {
  const { clearToken, token } = useContext(AuthContext)

  const logout = useCallback(() => {
    clearToken()
    router.replace('/login')
  }, [clearToken])

  const decodedToken = useDecodedToken(token)

  return (
    <View>
      <Text>
        { JSON.stringify(decodedToken, null, 2) }
      </Text>
      <Button
        onPress={logout}
      >Logout</Button>
    </View>
  )
}

export default ProfileScreen
