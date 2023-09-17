import { View, Text } from 'react-native'
import { useQuery } from 'urql'

import { graphql } from '../../gql'

export const GetUsersQuery = graphql(`
  query GetUsers {
    users {
      email
    }
  }
`)

const EntityList = () => {
  const [{ data }] = useQuery({
    query: GetUsersQuery,
    variables: {},
  })

  return (
    <View>
      {
        data?.users.map((entity) => <Text key={entity.email}>{entity.email}</Text>)
      }
    </View>
  )
}

export default EntityList
