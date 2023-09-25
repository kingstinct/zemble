/* eslint-disable react/style-prop-object */
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import LoginButton from 'readapt-plugin-auth-anonymous-expo/components/LoginButton'
import { SimpleAnonymousAuthProvider } from 'readapt-plugin-auth-anonymous-expo/contexts/Auth'

import UrqlProvider from './contexts/UrqlProvider'

export default function App() {
  return (
    <UrqlProvider>
      <SimpleAnonymousAuthProvider>
        <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
          <StatusBar style='auto' />
          <LoginButton />
        </View>
      </SimpleAnonymousAuthProvider>
    </UrqlProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
