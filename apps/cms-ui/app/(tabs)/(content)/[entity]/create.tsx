import { router, useLocalSearchParams } from 'expo-router'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '.'
import ModifyEntityEntry from '../../../../components/UpsertEntry'

const CreateEntity = () => {
  const { entity } = useLocalSearchParams()

  const [{ data }] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  return data?.getEntityByPluralizedName ? (
    <ModifyEntityEntry
      entity={data.getEntityByPluralizedName}
      onUpdated={() => {
        router.back()
      }}
    />
  ) : null
}

export default CreateEntity
