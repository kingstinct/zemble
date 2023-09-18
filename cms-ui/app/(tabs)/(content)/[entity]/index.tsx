import BottomSheet from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, Button,
} from 'react-native'
import { useQuery } from 'urql'

import CreateEntityEntry from '../../../../components/createEntityEntry'
import CreateField from '../../../../components/createEntityField'
import { graphql } from '../../../../gql'
import { capitalize } from '../../../../utils/text'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', borderColor: 'gray', borderWidth: StyleSheet.hairlineWidth, margin: 10, padding: 10, justifyContent: 'space-between',
  },
  cell: { alignSelf: 'stretch' },
  table: { borderRadius: 10, margin: 10, padding: 10 },
})

const ListOfEntries: React.FC<{readonly pluralizedName: string, readonly fields: readonly {readonly name: string, readonly __typename: string}[]}> = ({ fields, pluralizedName }) => {
  const fs = fields.map((field) => field.name)

  const queryName = `getAll${capitalize(pluralizedName)}`

  const [{ data }] = useQuery({
    query: `query GetEntries { ${queryName} { ${fs.join(' ')} } }`,
    variables: {},
  })

  const entries = data?.[queryName]

  return (
    <View style={styles.table}>
      <View
        style={[styles.row, { backgroundColor: 'black' }]}
      >
        { fs.map((f) => <Text key={f} style={[styles.cell, { color: 'white' }]}>{ f }</Text>) }
      </View>
      {
        entries?.map((entity) => (
          <View
            key={entity.id}
            style={styles.row}
          >
            { fs.map((f) => <Text key={f} style={styles.cell}>{ entity[f] ? entity[f].toString() : '(null)' }</Text>) }
          </View>
        ))
      }
    </View>
  )
}

export const GetEntityByPluralizedNameQuery = graphql(`
  query GetEntityByPluralizedName($pluralizedName: String!) { getEntityByPluralizedName(pluralizedName: $pluralizedName) { 
    name
    pluralizedName
    fields { 
      name
      __typename 
      isRequired
      isRequiredInput

      ... on StringField {
        defaultValueString: defaultValue
      }
      
      ... on NumberField {
        defaultValueNumber: defaultValue
      }
      
      ... on  BooleanField{
        defaultValueBoolean: defaultValue
      }
   } } }
`)

const EntityDetails = () => {
  const { entity, create } = useLocalSearchParams()

  const [{ data }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
  })

  const [index, setIndex] = useState(-1)

  useEffect(() => {
    const nextIndex = create && create !== 'false' ? 1 : -1
    setIndex(nextIndex)
  }, [create])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Button title='Modify schema' onPress={() => router.push(`/(tabs)/(content)/${entity as string}/schema`)} />
        { data?.getEntityByPluralizedName ? <ListOfEntries pluralizedName={data.getEntityByPluralizedName.pluralizedName} fields={data.getEntityByPluralizedName.fields} /> : null }
        <View style={{ height: 200 }} />
      </ScrollView>

      <BottomSheet
        snapPoints={[200, 500]}
        index={index}
        enablePanDownToClose
        onClose={() => router.setParams({ create: 'false' })}
        onChange={(i) => setIndex(i)}
      >
        { data?.getEntityByPluralizedName ? (
          <CreateEntityEntry
            entity={data.getEntityByPluralizedName}
            onUpdated={refetch}
          />
        ) : null }
      </BottomSheet>
    </View>
  )
}

export default EntityDetails
