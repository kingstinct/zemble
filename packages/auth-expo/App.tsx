import { useState } from 'react'
import { Button, SafeAreaView, Text } from 'react-native'

import LogoutButton from './components/LogoutButton'
import { ShowForAuthenticated } from './components/ShowForAuthenticated'
import { ShowForUnauthenticated } from './components/ShowForUnauthenticated'
import { AuthProvider } from './contexts/Auth'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  return (
    <SafeAreaView>
      <AuthProvider token={token} setToken={setToken}>
        <ShowForAuthenticated>
          <Text>Logged in!</Text>
          <LogoutButton />
        </ShowForAuthenticated>
        <ShowForUnauthenticated>
          <Text>Not logged in</Text>
          <Button
            title='Log in'
            onPress={() => setToken('a-very-real-token')}
          />
        </ShowForUnauthenticated>
      </AuthProvider>
    </SafeAreaView>
  )
}
