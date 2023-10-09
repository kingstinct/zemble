import { useLocalSearchParams } from 'expo-router'
import { useQuery } from 'urql'

import { GetEntityByPluralizedNameQuery } from '..'
import CreateField from '../../../../../components/createEntityField'

const AddField = () => {
  const { entity } = useLocalSearchParams()

  const [{ data }, refetch] = useQuery({
    query: GetEntityByPluralizedNameQuery,
    variables: { pluralizedName: entity },
    pause: !entity,
  })

  return data?.getEntityByPluralizedName ? (
    <CreateField
      entityName={data.getEntityByPluralizedName.name}
      onUpdated={refetch}
    />
  ) : null
}

export default AddField
