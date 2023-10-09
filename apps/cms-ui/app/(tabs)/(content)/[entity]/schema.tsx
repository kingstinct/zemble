import BottomSheet from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  View, Text, ScrollView,
} from 'react-native'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '.'
import CreateField from '../../../../components/createEntityField'
import { styles } from '../../../../style'
import { RefreshControl } from 'react-native-gesture-handler'
import { DataTable } from 'react-native-paper'

const EntityDetails = () => {
  const { entity, selectedId: selectedIdRaw } = useLocalSearchParams()

  const [{ data, fetching }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  const bottomSheet = useRef<BottomSheet>(null)

  useEffect(() => {
    if(selectedIdRaw === 'new'){
      bottomSheet.current?.expand()
    }
  }, [selectedIdRaw])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView refreshControl={
          <RefreshControl 
            refreshing={fetching} 
            onRefresh={refetch} />
        }>
        
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Type</DataTable.Title>
            <DataTable.Title>Required (In/Out)</DataTable.Title>
          </DataTable.Header>
          {
            data?.getEntityByPluralizedName?.fields.map((field) => 
            <DataTable.Row key={field.name}>
              <DataTable.Cell><Text key={field.name}>{field.name}</Text></DataTable.Cell>
              <DataTable.Cell><Text key={field.name}>{field.__typename}</Text></DataTable.Cell>
              <DataTable.Cell><Text key={field.name}>{(field.isRequiredInput ? 'Yes' : 'No') + ' / ' + (field.isRequired ? 'Yes' : 'No')}</Text></DataTable.Cell>
            </DataTable.Row>
            )
          }
        </DataTable>
        <Text>{ JSON.stringify(data?.getEntityByPluralizedName, null, 2) }</Text>
        <View style={{ height: 200 }} />
      </ScrollView>

      <BottomSheet
        ref={bottomSheet}
        snapPoints={[200, 500]}
        index={-1}
        enablePanDownToClose
        onChange={(index) => {
          if(index === -1){
            router.setParams({ selectedId: '' })
          }
        }}
        backgroundStyle={styles.bottomSheetBackground}
      >
        { data?.getEntityByPluralizedName ? (
          <CreateField
            entityName={data.getEntityByPluralizedName.name}
            onUpdated={refetch}
          />
        ) : null }
      </BottomSheet>
    </View>
  )
}

export default EntityDetails
