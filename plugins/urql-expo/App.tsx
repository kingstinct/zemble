import { Text } from 'react-native'

import { GRAPHQL_ENDPOINT } from './config'
import UrqlProvider from './contexts/UrqlProvider'

export default function App() {
  return (
    <UrqlProvider>
      <Text>{ `Will connect to ${GRAPHQL_ENDPOINT}` }</Text>
    </UrqlProvider>
  )
}
