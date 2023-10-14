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
    variables: { namePlural: entity },
    pause: !entity,
  })

  const [{ data: entitiesData }] = useQuery({
    query: GetEntitiesDocument,
    variables: {},
    pause: !entity,
  })

  return data?.getEntityByNamePlural && entitiesData ? (
    <PaperProvider>
      <UpsertField
        entity={data.getEntityByNamePlural}
        availableEntityNames={entitiesData.getAllEntities.map((e) => e.namePlural)}
        onUpdated={() => {
          refetch()
          router.back()
        }}
      />
    </PaperProvider>
  ) : null
}

export default AddField
