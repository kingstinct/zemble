import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from 'urql'

import { GetEntityByNamePluralQuery } from '.'
import ModifyEntityEntry from '../../../../components/UpsertEntry'

const CreateEntity = () => {
  const { entity } = useLocalSearchParams()

  const [{ data }] = useQuery({
    query: GetEntityByNamePluralQuery,
    variables: { namePlural: entity },
    pause: !entity,
  })

  return data?.getEntityByNamePlural ? (
    <ModifyEntityEntry
      entity={data.getEntityByNamePlural}
      onUpdated={() => {
        router.back()
      }}
    />
  ) : null
}

export default CreateEntity
