import { router, useLocalSearchParams } from 'expo-router'
import { PaperProvider } from 'react-native-paper'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '../..'
import UpsertField from '../../../../../../components/UpsertField'
import { GetEntitiesDocument } from '../../../../../../gql/graphql'

const AddField = () => {
  const { entity } = useLocalSearchParams()

  const [{ data }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  const [{ data: entitiesData }] = useQuery({
    query: GetEntitiesDocument,
    variables: {},
    pause: !entity,
  })

  return data?.getEntityByPluralizedName && entitiesData ? (
    <PaperProvider>
      <UpsertField
        entity={data.getEntityByPluralizedName}
        availableEntityNames={entitiesData.getAllEntities.map((e) => e.name)}
        onUpdated={() => {
          refetch()
          router.back()
        }}
      />
    </PaperProvider>
  ) : null
}

export default AddField
