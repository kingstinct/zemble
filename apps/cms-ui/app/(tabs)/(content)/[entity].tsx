import BottomSheet from '@gorhom/bottom-sheet'
import { useLocalSearchParams } from 'expo-router'
import {
  View, Text, Button, StyleSheet,
} from 'react-native'
import { useMutation, useQuery } from 'urql'

import CreateEntityEntry from '../../../components/createEntityEntry'
import { graphql } from '../../../gql'
import { pluralize, singularize } from '../../../utils/text'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', borderColor: 'gray', borderWidth: StyleSheet.hairlineWidth, margin: 10, padding: 10, justifyContent: 'space-between',
  },
  cell: { alignSelf: 'stretch' },
  table: { borderRadius: 10, margin: 10, padding: 10 },
})

const ListOfEntries: React.FC<{readonly name: string, readonly fields: readonly {readonly name: string, readonly __typename: string}[]}> = ({ fields, name }) => {
  const fs = fields.map((field) => field.name)

  const [{ data }] = useQuery({
    query: `query GetEntries { ${name}s { ${fs.join(' ')} } }`,
    variables: {},
  })

  const plural = pluralize(name)

  const entries = data?.[plural]

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
            key={entity._id}
            style={styles.row}
          >
            { fs.map((f) => <Text key={f} style={styles.cell}>{ entity[f] ?? '(null)' }</Text>) }
          </View>
        ))
      }
    </View>
  )
}

const GetEntityQuery = graphql(`
  query GetEntity($name: String!) { entity(name: $name) { name fields { 
    name 
    __typename 
    isRequired

    ... on StringField {
    defaultValueString: defaultValue
  }
  
  ... on NumberField {
    defaultValueNumber:defaultValue
  }
  
  ... on  BooleanField{
    defaultValueBoolean:defaultValue
  }
   } } }
`)
export const AddFieldsToEntityMutation = graphql(`
  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {
    addFieldsToEntity(entityName: $name, fields: $fields) {
      name
    }
  }
`)

const EntityDetails = () => {
  const { entity: entityIn } = useLocalSearchParams()

  const entity = singularize(entityIn as string)

  const [{ data }, refetch] = useQuery({
    query: GetEntityQuery,
    variables: { name: entity },
  })

  const [, addFieldsToEntity] = useMutation(AddFieldsToEntityMutation)

  console.log({ entity, data })

  return (
    <View>
      <Button
        onPress={async () => {
          const fieldName = prompt('Field name', '')
          await addFieldsToEntity({ name: entity as string, fields: [{ StringField: { name: fieldName } }] })
          refetch()
        }}
        title='Add string field'
      />
      <Text>{ `Entity JSON:${JSON.stringify(data?.entity, null, 2)}` }</Text>

      { data?.entity?.fields ? <ListOfEntries name={entity as string} fields={data.entity.fields} /> : null }

      <BottomSheet snapPoints={[100, 500]}>
        { data ? <CreateEntityEntry entity={data.entity} /> : null }
      </BottomSheet>
    </View>
  )
}

export default EntityDetails
