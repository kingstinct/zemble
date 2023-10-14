import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from 'urql'

import { GetEntityByNamePluralQuery } from '..'
import UpsertEntry from '../../../../../components/UpsertEntry'

const EditEntityInstance = () => {
  const { entity, id } = useLocalSearchParams()

  const [{ data }] = useQuery({
    query: GetEntityByNamePluralQuery,
    variables: { namePlural: entity },
    pause: !entity,
  })

  return data?.getEntityByNamePlural ? (
    <UpsertEntry
      entity={data.getEntityByNamePlural}
      previousEntryId={id as string}
      onUpdated={() => {
        router.back()
      }}
    />
  ) : null
}

export default EditEntityInstance
