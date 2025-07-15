import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from 'urql'
import UpsertEntry from '../../../../../components/UpsertEntry'
import { GetEntityByNamePluralQuery } from '..'

const EditEntityInstance = () => {
  const { entity, id } = useLocalSearchParams()

  const [{ data }] = useQuery({
    query: GetEntityByNamePluralQuery,
    variables: { namePlural: entity as string },
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
