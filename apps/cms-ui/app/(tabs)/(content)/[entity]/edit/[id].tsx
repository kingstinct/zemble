import { useLocalSearchParams } from 'expo-router'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '..'
import ModifyEntityEntry from '../../../../../components/modifyEntityEntry'

const EditEntityInstance = () => {
  const { entity, id } = useLocalSearchParams()

  const [{ data }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  return data?.getEntityByPluralizedName ? (
    <ModifyEntityEntry
      entity={data.getEntityByPluralizedName}
      previousEntryId={id as string}
      onUpdated={refetch}
    />
  ) : null
}

export default EditEntityInstance
