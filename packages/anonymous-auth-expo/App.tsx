import { SafeAreaView, Text } from 'react-native'
import LogoutButton from 'zemble-plugin-auth-expo/components/LogoutButton'
import { ShowForAuthenticated } from 'zemble-plugin-auth-expo/components/ShowForAuthenticated'
import { ShowForUnauthenticated } from 'zemble-plugin-auth-expo/components/ShowForUnauthenticated'
import UrqlProvider from 'zemble-plugin-urql-expo/contexts/UrqlProvider'

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
