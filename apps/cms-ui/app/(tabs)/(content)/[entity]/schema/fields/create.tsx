import { router, useLocalSearchParams } from 'expo-router'
import { PaperProvider } from 'react-native-paper'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '../..'
import UpsertField from '../../../../../../components/UpsertField'

const AddField = () => {
  const { entity } = useLocalSearchParams()

  const [{ data }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  return data?.getEntityByPluralizedName ? (
    <PaperProvider>
      <UpsertField
        entity={data.getEntityByPluralizedName}
        onUpdated={() => {
          refetch()
          router.back()
        }}
      />
    </PaperProvider>
  ) : null
}

export default AddField
