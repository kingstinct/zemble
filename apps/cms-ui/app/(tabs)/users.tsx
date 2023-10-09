import { View, Text } from 'react-native'
import { useQuery } from 'urql'

import { graphql } from '../../gql'
import { DataTable } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

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
        {
          data?.users.map((entity) => 
          <DataTable.Row key={entity.email}>
            <DataTable.Cell><Text key={entity.email}>{entity.email}</Text></DataTable.Cell>
          </DataTable.Row>
          )
        }
      </DataTable>
    </ScrollView>
  )
}

export default UserList
