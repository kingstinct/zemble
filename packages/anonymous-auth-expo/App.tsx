import { SafeAreaView, Text } from 'react-native'
import LogoutButton from 'readapt-plugin-auth-expo/components/LogoutButton'
import { ShowForAuthenticated } from 'readapt-plugin-auth-expo/components/ShowForAuthenticated'
import { ShowForUnauthenticated } from 'readapt-plugin-auth-expo/components/ShowForUnauthenticated'
import UrqlProvider from 'readapt-plugin-urql-expo/contexts/UrqlProvider'

import LoginButton from './components/LoginButton'
import { SimpleAnonymousAuthProvider } from './contexts/Auth'

export default function App() {
  return (
    <SafeAreaView>
      <UrqlProvider>
        <SimpleAnonymousAuthProvider>
          <ShowForAuthenticated>
            <Text>Logged in!</Text>
            <LogoutButton />
          </ShowForAuthenticated>
          <ShowForUnauthenticated>
            <Text>Not logged in</Text>
            <LoginButton />
          </ShowForUnauthenticated>
        </SimpleAnonymousAuthProvider>
      </UrqlProvider>
    </SafeAreaView>
  )
}
