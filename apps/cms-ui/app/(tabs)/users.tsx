import { View, Text, Button } from 'react-native'
import { useMutation, useQuery } from 'urql'

import { graphql } from '../../gql'
import { useContext } from 'react'
import { AuthContext } from '@kingstinct/react'
import { router } from 'expo-router'

export const GetUsersQuery = graphql(`
  query GetUsers {
    users {
      email
    }
  }
`)

const EntityList = () => {
  const {clearToken} = useContext(AuthContext)
  const [{ data }] = useQuery({
    query: GetUsersQuery,
    variables: {},
  })

  const logout = () => {
    clearToken()
    router.replace('/login')
  }

  return (
    <View>
      <Button onPress={logout} title='Logout' />
      <Button onPress={() => router.back()} title='Back' />
      {
        data?.users.map((entity) => <Text key={entity.email}>{entity.email}</Text>)
      }
    </View>
  )
}

export default EntityList
