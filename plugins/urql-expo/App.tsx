import { StyleSheet, Text, View } from 'react-native';
import UrqlProvider from './contexts/UrqlProvider';
import { GRAPHQL_ENDPOINT } from './config';

export default function App() {
  return (
    <UrqlProvider>
      <Text>{ 'Will connect to ' + GRAPHQL_ENDPOINT }</Text>
    </UrqlProvider>
  );
}