import { router, useLocalSearchParams } from 'expo-router'
import { PaperProvider } from 'react-native-paper'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '../..'
import CreateField from '../../../../../../components/UpsertField'
import { GetEntitiesDocument } from '../../../../../../gql/graphql'

const AddField = () => {
  const { entity, fieldName } = useLocalSearchParams()

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

  return data?.getEntityByPluralizedName ? (
    <PaperProvider>
      <CreateField
        entity={data.getEntityByPluralizedName}
        fieldNameToModify={fieldName as string}
        availableEntityNames={entitiesData?.getAllEntities.map((e) => e.name) ?? []}
        onUpdated={() => {
          refetch()
          router.back()
        }}
      />
    </PaperProvider>
  ) : null
}

export default AddField
