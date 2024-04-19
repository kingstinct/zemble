import { router, useLocalSearchParams } from 'expo-router'
import { PaperProvider } from 'react-native-paper'
import { useQuery } from 'urql'

import { GetEntityByNamePluralQuery } from '../..'
import CreateField from '../../../../../../components/UpsertField'
import { GetEntitiesDocument } from '../../../../../../gql.generated/graphql'

const AddField = () => {
  const { entity, fieldName } = useLocalSearchParams()

  const [{ data }, refetch] = useQuery({
    query: GetEntityByNamePluralQuery,
    variables: { namePlural: entity },
    pause: !entity,
  })

  const [{ data: entitiesData }] = useQuery({
    query: GetEntitiesDocument,
    variables: {},
    pause: !entity,
  })

  return data?.getEntityByNamePlural ? (
    <PaperProvider>
      <CreateField
        entity={data.getEntityByNamePlural}
        fieldNameToModify={fieldName as string}
        availableEntityNames={entitiesData?.getAllEntities.map((e) => e.namePlural) ?? []}
        onUpdated={() => {
          refetch()
          router.back()
        }}
      />
    </PaperProvider>
  ) : null
}

export default AddField
