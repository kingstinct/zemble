import BottomSheet from '@gorhom/bottom-sheet'
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import {
  View, ScrollView, Button, RefreshControl,
} from 'react-native'
import { useQuery } from 'urql'

import ModifyEntityEntry from '../../../../components/modifyEntityEntry'
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
  const { entity, selectedId: selectedIdRaw } = useLocalSearchParams()

  console.log('selectedIdRaw', selectedIdRaw)

  const selectedId = selectedIdRaw === '' || selectedIdRaw === 'new' ? undefined : selectedIdRaw as string | undefined

  const [{ data, fetching }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  const bottomSheet = useRef<BottomSheet>(null)

  useEffect(() => {
    if(selectedIdRaw === 'new') {
      bottomSheet.current?.expand()
    }
  }, [selectedIdRaw])

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
              router.setParams({ selectedId: s.id!.toString() })
              bottomSheet.current?.expand()
            }}
            pluralizedName={data.getEntityByPluralizedName.pluralizedName}
            fields={data.getEntityByPluralizedName.fields}
          />
        ) : null }
        <View style={{ height: 200 }} />
      </ScrollView>

      <BottomSheet
        ref={bottomSheet}
        snapPoints={[200, 500]}
        enablePanDownToClose
        index={-1}
        onClose={() => {
          // router.setParams({ selectedId: '' })
        }}
        onChange={(index) => {
if(index === -1){
  router.setParams({ selectedId: '' })
}
        }}
        backgroundStyle={styles.bottomSheetBackground}
      >
        { data?.getEntityByPluralizedName ? (
          <ModifyEntityEntry
            entity={data.getEntityByPluralizedName}
            previousEntryId={selectedId}
            onUpdated={refetch}
          />
        ) : null }
      </BottomSheet>
    </View>
  )
}

export default EntityDetails
