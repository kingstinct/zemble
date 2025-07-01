import { Styles } from '@zemble/react'
import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { Button, DataTable } from 'react-native-paper'
import { useQuery } from 'urql'

import { GetEntityByNamePluralQuery } from '..'

const EntityDetails = () => {
  const { entity } = useLocalSearchParams()

  const [{ data, fetching }, refetch] = useQuery({
    query: GetEntityByNamePluralQuery,
    variables: { namePlural: entity },
    pause: !entity,
  })

  return (
    <View style={{ flex: 1 }}>
      <ScrollView refreshControl={<RefreshControl refreshing={fetching} onRefresh={refetch} />}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Type</DataTable.Title>
            <DataTable.Title>Required</DataTable.Title>
          </DataTable.Header>
          {data?.getEntityByNamePlural?.fields.map((field) => (
            <DataTable.Row key={field.name} onPress={() => router.push(`/(tabs)/(content)/${entity}/schema/fields/${field.name}`)}>
              <DataTable.Cell>
                <Text key={field.name}>{field.name}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text key={field.name}>{field.__typename}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                <Text key={field.name}>{field.isRequired ? 'Yes' : 'No'}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
          <Button icon='plus' style={Styles.margin8} onPress={() => router.push(`/(tabs)/(content)/${entity}/schema/fields/create`)}>
            Add Field
          </Button>
        </DataTable>
        <Text>{JSON.stringify(data?.getEntityByNamePlural, null, 2)}</Text>
        <View style={{ height: 200 }} />
      </ScrollView>
    </View>
  )
}

export default EntityDetails
