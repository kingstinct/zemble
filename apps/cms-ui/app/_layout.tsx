import AuthProvider, { AuthContext, Status } from '@kingstinct/react/contexts/Auth'
import UrqlProvider from '@kingstinct/react/contexts/Urql'
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native'
import { Stack, router, useSegments } from 'expo-router'
import { useContext, useEffect, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import {
  PaperProvider, MD3DarkTheme, MD2LightTheme, MD2DarkTheme, MD3LightTheme,
} from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import createClientWithToken from '../clients/urql'

function useProtectedRoute(token: string | null, status: Status) {
  const segments = useSegments()

  useEffect(() => {
    if (status !== Status.INITIALIZING) {
      const inAuthGroup = segments[0] === '(auth)'

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !token && !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.replace('/login')
      } else if (token && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace('/(tabs)/(content)/index')
      }
    }
  }, [token, segments, status])
}

const App = () => {
  const { token, status } = useContext(AuthContext)
  useProtectedRoute(token, status)

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          animation: 'flip',
          headerShown: false,
          animationTypeForReplace: 'pop',
        }}
      >
        {/* <Stack.Screen
          name='(tabs)/index'
          options={{
            title: 'cms-ui',
            headerShown: false,
          }}
        /> */}
        <Stack.Screen
          name='(auth)/login'
          options={{
            title: 'Login',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  )
}

export default () => {
  const colorScheme = useColorScheme()

  const navigationTheme = useMemo(() => (colorScheme === 'dark'
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, primary: MD3DarkTheme.colors.primary } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: MD3LightTheme.colors.primary } }), [colorScheme])

  return (
    <ThemeProvider value={navigationTheme}>
      <PaperProvider>
        <AuthProvider>
          <UrqlProvider
            onError={(error) => alert(error.message)}
            createClient={createClientWithToken}
          >
            <App />
          </UrqlProvider>
        </AuthProvider>
      </PaperProvider>
    </ThemeProvider>
  )
}
