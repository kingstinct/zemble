import { router, useLocalSearchParams } from 'expo-router'
import {
  View,
} from 'react-native'
import { Button } from 'react-native-paper'
import { useQuery } from 'urql'

import ListOfEntries from '../../../../components/ListOfEntries'
import { graphql } from '../../../../gql'

export const GetEntityByPluralizedNameQuery = graphql(`
  query GetEntityByPluralizedName($pluralizedName: String!) { getEntityByPluralizedName(pluralizedName: $pluralizedName) { 
    name
    pluralizedName
    fields { 
      name
      __typename 
      isRequired
      isRequiredInput

      ... on EntityRelationField {
        entityName
      }

      ... on StringField {
        defaultValueString: defaultValue
        isSearchable
      }
      
      ... on NumberField {
        defaultValueNumber: defaultValue
      }
      
      ... on  BooleanField{
        defaultValueBoolean: defaultValue
      }
      ... on ArrayField {
        availableFields {
          name
          __typename
        }
      }
   } } }
`)

const EntityDetails = () => {
  const { entity } = useLocalSearchParams()

  const [{ data }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  return (
    <View style={{ flex: 1 }}>
      <Button mode='contained' style={{ margin: 16 }} onPress={() => router.push(`/(tabs)/(content)/${entity as string}/create`)}>{ `Create ${data?.getEntityByPluralizedName?.name}` }</Button>
      { data?.getEntityByPluralizedName ? (
        <ListOfEntries
          entityName={data.getEntityByPluralizedName.name}
          onSelected={(s) => {
            router.push(`/(tabs)/(content)/${entity as string}/edit/${s.id}`)
          }}
          pluralizedName={data.getEntityByPluralizedName.pluralizedName}
          fields={data.getEntityByPluralizedName.fields}
        />
      ) : null }
    </View>
  )
}

export default EntityDetails
