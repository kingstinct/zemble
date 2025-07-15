import { Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { DataTable } from 'react-native-paper'
import { useQuery } from 'urql'

import { graphql } from '../../gql.generated'

export const GetUsersQuery = graphql(`
  query GetUsers {
    users {
      email
    }
  }
`)

const UserList = () => {
  const [{ data }] = useQuery({
    query: GetUsersQuery,
    variables: {},
  })

  return (
    <ScrollView>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Email</DataTable.Title>
        </DataTable.Header>
        {data?.users.map((entity) => (
          <DataTable.Row key={entity.email}>
            <DataTable.Cell>
              <Text key={entity.email}>{entity.email}</Text>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  )
}

export default UserList
