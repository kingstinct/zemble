import { router, useLocalSearchParams } from 'expo-router'
import {
  View, ScrollView, RefreshControl,
} from 'react-native'
import { Button } from 'react-native-paper'
import { useMutation, useQuery } from 'urql'

import ListOfEntries from '../../../../components/ListOfEntries'
import { graphql } from '../../../../gql'
import { useCallback } from 'react'

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

  const [{ data, fetching }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={fetching}
            onRefresh={refetch}
          />
        )}
      >
        <Button mode='contained' style={{ margin: 16 }} onPress={() => router.push(`/(tabs)/(content)/${entity as string}/schema`)}>Modify schema</Button>
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
        <View style={{ height: 200 }} />
      </ScrollView>
    </View>
  )
}

export default EntityDetails
