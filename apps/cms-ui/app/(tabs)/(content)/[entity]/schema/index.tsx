import { useLocalSearchParams } from 'expo-router'
import {
  View, Text, ScrollView,
} from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { DataTable } from 'react-native-paper'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '..'

const EntityDetails = () => {
  const { entity } = useLocalSearchParams()

  const [{ data, fetching }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  return (
    <View style={{ flex: 1 }}>
      <ScrollView refreshControl={(
        <RefreshControl
          refreshing={fetching}
          onRefresh={refetch}
        />
      )}
      >
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Type</DataTable.Title>
            <DataTable.Title>Required (In/Out)</DataTable.Title>
          </DataTable.Header>
          {
            data?.getEntityByPluralizedName?.fields.map((field) => (
              <DataTable.Row key={field.name}>
                <DataTable.Cell><Text key={field.name}>{field.name}</Text></DataTable.Cell>
                <DataTable.Cell><Text key={field.name}>{field.__typename}</Text></DataTable.Cell>
                <DataTable.Cell><Text key={field.name}>{`${field.isRequiredInput ? 'Yes' : 'No'} / ${field.isRequired ? 'Yes' : 'No'}`}</Text></DataTable.Cell>
              </DataTable.Row>
            ))
          }
        </DataTable>
        <Text>{ JSON.stringify(data?.getEntityByPluralizedName, null, 2) }</Text>
        <View style={{ height: 200 }} />
      </ScrollView>
    </View>
  )
}

export default EntityDetails
