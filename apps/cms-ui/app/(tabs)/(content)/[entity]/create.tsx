import { useLocalSearchParams } from 'expo-router'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '.'
import ModifyEntityEntry from '../../../../components/modifyEntityEntry'

const CreateEntity = () => {
  const { entity } = useLocalSearchParams()

  const [{ data, fetching }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  return data?.getEntityByPluralizedName ? (
    <ModifyEntityEntry
      entity={data.getEntityByPluralizedName}
      onUpdated={refetch}
    />
  ) : null
}

export default CreateEntity
