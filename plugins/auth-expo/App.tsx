import { useState } from 'react'
import { Button, SafeAreaView, Text } from 'react-native'

import LogoutButton from './components/LogoutButton'
import { AuthProvider, OnlyVisibleForAuthenticated, OnlyVisibleForUnauthenticated } from './contexts/Auth'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  return (
    <SafeAreaView>
      <AuthProvider token={token} setToken={setToken}>
        <OnlyVisibleForAuthenticated>
          <Text>Logged in!</Text>
          <LogoutButton />
        </OnlyVisibleForAuthenticated>
        <OnlyVisibleForUnauthenticated>
          <Text>Not logged in</Text>
          <Button title='Log in' onPress={() => setToken('a-very-real-token')} />
        </OnlyVisibleForUnauthenticated>
      </AuthProvider>
    </SafeAreaView>
  )
}
