import { View, Text, Button } from 'react-native'
import { useMutation, useQuery } from 'urql'

import { router, useLocalSearchParams } from 'expo-router'
import { graphql } from '../../gql'

const ListOfEntries: React.FC<{name: string, fields: {name: string, __typename: string}[]}> = ({ fields, name }) => {
  const fs = fields.map((field) => field.name)
  
  const [{ data }] = useQuery({
    query: `query GetEntries { ${name}s { ${fs.join(' ')} } }`,
    variables: {},
  })

  return <View>{
    data?.books?.map((entity) => <Text key={entity.title}>{entity.title}</Text>)
    
  }
  <Button onPress={() => {
    // const title = prompt('Title', '')
    // if (title) {
    //   void createEntityMutation({ name, title })
    // }
  }} title={'Create ' + name }></Button>
  </View>
}

const GetEntityQuery = graphql(`
  query GetEntity($name: String!) { entity(name: $name) { name fields { name __typename } } }
`)
export const AddFieldsToEntityMutation = graphql(`
  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {
    addFieldsToEntity(entityName: $name, fields: $fields) {
      name
    }
  }
`)


const EntityDetails = () => {
  const { entity } = useLocalSearchParams();

  const [{ data }] = useQuery({
    query: GetEntityQuery,
    variables: { name: entity },
  })

  const [,addFieldsToEntity] = useMutation(AddFieldsToEntityMutation)

  console.log({entity, data})

  return (
    <View>
      <Button onPress={() => router.back()} title='Back' />
      <Button onPress={() => {
        const fieldName = prompt('Field name', '')
        addFieldsToEntity({ name: entity as string, fields: [{ StringField: { name: fieldName } }] })
      }} title='Add string field' />
      <Text>{ 'Entity JSON:' + JSON.stringify(data?.entity, null, 2) }</Text>

      { data?.entity?.fields ? <ListOfEntries name={entity as string} fields={data.entity.fields} /> : null }
    </View>
  )
}

export default EntityDetails
