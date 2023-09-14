import AuthProvider, { AuthContext } from '@kingstinct/react/contexts/Auth'
import UrqlProvider from '@kingstinct/react/contexts/Urql'
import { Stack, router, useSegments } from 'expo-router'
import { useContext, useEffect } from 'react'

import createClientWithToken from '../clients/urql'

function useProtectedRoute(token?: string | null) {
  const segments = useSegments()

  useEffect(() => {
    setTimeout(() => {
      const inAuthGroup = segments[0] === '(auth)'

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !token && !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.replace('/login')
      } else if (token && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace('/(tabs)/entities')
      }
    }, 0)
  }, [token, segments])
}

const App = () => {
  const {token} = useContext(AuthContext)
  useProtectedRoute(token)

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // headerStyle: { backgroundColor: theme.backgroundStrong.get() },
        animation: 'flip',
        animationTypeForReplace: 'pop',
        // contentStyle: { backgroundColor: theme.backgroundStrong.get() },
        // headerTitleStyle: { color: theme.color.get() },
      }}
    >
      <Stack.Screen
        name='(tabs)/entities'
        options={{
          title: 'Tabs',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='(auth)/login'
        options={{
          title: 'Tabs',
          headerShown: false,
        }}
      />
    </Stack>
  )
}

export default () => (
  <AuthProvider>
    <UrqlProvider
      onError={(error) => alert(error.message)}
      createClient={createClientWithToken}
    >
      <App />
    </UrqlProvider>
  </AuthProvider>
)
