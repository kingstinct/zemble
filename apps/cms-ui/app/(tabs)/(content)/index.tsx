import { router } from 'expo-router'
import { View, Button } from 'react-native'
import { useQuery } from 'urql'

import { graphql } from '../../../gql'
import { capitalize, pluralize } from '../../../utils/text'

export const GetEntitiesQuery = graphql(`
  query GetEntities {
    getAllEntities {
      name
      pluralizedName
      fields {
        name
        isRequired
      }
    }
  }
`)

const EntityList = () => {
  const [{ data }] = useQuery({
    query: GetEntitiesQuery,
    variables: {},
  })

  return (
    <View>
      {
        data?.getAllEntities.map((entity) => (
          <View key={entity.name} style={{ margin: 10 }}>
            <Button
              title={capitalize(pluralize(entity.name))}
              onPress={() => {
                // @ts-expect-error fix later
                router.push(`/${entity.pluralizedName}`)
              }}
            />
          </View>
        ))
      }
    </View>
  )
}

export default EntityList
