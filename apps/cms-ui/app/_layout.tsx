import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import AuthProvider, {
  AuthContext,
  Status,
} from '@zemble/react-auth/contexts/Auth'
import UrqlProvider from '@zemble/react-urql/contexts/Urql'
import { router, Stack, useSegments } from 'expo-router'
import { useContext, useEffect, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import createClientWithToken from '../clients/urql'

function useProtectedRoute(token: string | null, status: Status) {
  const segments = useSegments()

  useEffect(() => {
    if (status !== Status.INITIALIZING) {
      const inAuthGroup = segments[0] === '(auth)'

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !token &&
        !inAuthGroup
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

  const navigationTheme = useMemo(
    () =>
      colorScheme === 'dark'
        ? {
            ...DarkTheme,
            colors: {
              ...DarkTheme.colors,
              primary: MD3DarkTheme.colors.primary,
            },
          }
        : {
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              primary: MD3LightTheme.colors.primary,
            },
          },
    [colorScheme],
  )

  return (
    <ThemeProvider value={navigationTheme}>
      <AuthProvider>
        <UrqlProvider
          onError={(error) => console.error('GraphQL Error:', error.message)}
          createClient={createClientWithToken}
        >
          <PaperProvider>
            <App />
          </PaperProvider>
        </UrqlProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
