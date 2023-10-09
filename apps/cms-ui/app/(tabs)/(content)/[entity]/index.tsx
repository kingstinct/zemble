import BottomSheet from '@gorhom/bottom-sheet'
import { router, useGlobalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  View, ScrollView, Button, RefreshControl,
} from 'react-native'
import { useQuery } from 'urql'

import CreateEntityEntry from '../../../../components/createEntityEntry'
import ListOfEntries from '../../../../components/ListOfEntries'
import { graphql } from '../../../../gql'
import { styles } from '../../../../style'

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
  const { entity, create } = useGlobalSearchParams()

  const [{ data, fetching }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  const [index, setIndex] = useState(-1)

  useEffect(() => {
    const nextIndex = create && create !== 'false' ? 1 : -1
    setIndex(nextIndex)
  }, [create])

  const [selected, setSelected] = useState<Record<string, unknown> | null>(null)

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        refreshControl={
          <RefreshControl 
            refreshing={fetching} 
            onRefresh={refetch} />
        }>
        <Button title='Modify schema' onPress={() => router.push(`/(tabs)/(content)/${entity as string}/schema`)} />
        { data?.getEntityByPluralizedName ? (
          <ListOfEntries
            entityName={data.getEntityByPluralizedName.name}
            onSelected={(s) => {
              setSelected(s)
              router.setParams({ create: 'true' })
            }}
            pluralizedName={data.getEntityByPluralizedName.pluralizedName}
            fields={data.getEntityByPluralizedName.fields}
          />
        ) : null }
        <View style={{ height: 200 }} />
      </ScrollView>

      <BottomSheet
        snapPoints={[200, 500]}
        index={index}
        enablePanDownToClose
        onClose={() => {
          router.setParams({ create: 'false' })
          setSelected(null)
        }}
        backgroundStyle={styles.bottomSheetBackground}
        onChange={(i) => setIndex(i)}
      >
        { data?.getEntityByPluralizedName ? (
          <CreateEntityEntry
            entity={data.getEntityByPluralizedName}
            previousEntry={selected}
            onUpdated={refetch}
          />
        ) : null }
      </BottomSheet>
    </View>
  )
}

export default EntityDetails
