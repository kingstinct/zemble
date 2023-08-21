import { SafeAreaView, Text } from 'react-native';

import { OnlyVisibleForAuthenticated, OnlyVisibleForUnauthenticated } from 'readapt-plugin-auth-expo/contexts/Auth';
import LogoutButton from 'readapt-plugin-auth-expo/components/LogoutButton';
import UrqlProvider from 'readapt-plugin-urql-expo/contexts/UrqlProvider';
import LoginButton from './components/LoginButton';
import { SimpleAnonymousAuthProvider } from './contexts/Auth';

export default function App() {
return (
    <SafeAreaView>
      <UrqlProvider>
      <SimpleAnonymousAuthProvider>
        <OnlyVisibleForAuthenticated>
          <Text>Logged in!</Text>
          <LogoutButton />
        </OnlyVisibleForAuthenticated>
        <OnlyVisibleForUnauthenticated>
          <Text>Not logged in</Text>
          <LoginButton />
        </OnlyVisibleForUnauthenticated>
      </SimpleAnonymousAuthProvider>
      </UrqlProvider>
    </SafeAreaView>
  );
}