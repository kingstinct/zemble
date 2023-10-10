import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '../..'
import CreateField from '../../../../../../components/UpsertField'
import { PaperProvider } from 'react-native-paper'

const AddField = () => {
  const { entity, fieldName } = useLocalSearchParams()

  const [{ data }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  return data?.getEntityByPluralizedName ? (
    <PaperProvider>
      <CreateField
        entity={data.getEntityByPluralizedName}
        fieldNameToModify={fieldName as string}
        onUpdated={() => {
          refetch()
          router.back()
        }}
      />
    </PaperProvider>
  ) : null
}

export default AddField
