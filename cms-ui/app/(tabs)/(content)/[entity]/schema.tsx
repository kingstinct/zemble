import BottomSheet from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  View, Text, ScrollView,
} from 'react-native'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '.'
import CreateField from '../../../../components/createEntityField'
import { styles } from '../../../../style'

const EntityDetails = () => {
  const { entity, create } = useLocalSearchParams()

  const [{ data }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  const [index, setIndex] = useState(-1)

  useEffect(() => {
    const nextIndex = create && create !== 'false' ? 1 : -1
    setIndex(nextIndex)
  }, [create])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Text>{ JSON.stringify(data?.getEntityByPluralizedName, null, 2) }</Text>
        <View style={{ height: 200 }} />
      </ScrollView>

      <BottomSheet
        snapPoints={[200, 500]}
        index={index}
        onClose={() => router.setParams({ create: 'false' })}
        enablePanDownToClose
        onChange={(i) => setIndex(i)}
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
