import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SimpleAnonymousAuthProvider } from 'readapt-plugin-anonymous-auth-expo/contexts/Auth';
import LoginButton from 'plugins/anonymous-auth-expo/components/LoginButton';

export default function App() {
  return (
    <UrqlProvider>
      <SimpleAnonymousAuthProvider>
        <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
          <StatusBar style="auto" />
          <LoginButton />
        </View>
      </SimpleAnonymousAuthProvider>
    </UrqlProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
