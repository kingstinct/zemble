import { router } from 'expo-router'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { useMutation, useQuery } from 'urql'

import { graphql } from '../../../gql'
import { capitalize, pluralize } from '../../../utils/text'
import { useCallback } from 'react'
import { Styles } from '@kingstinct/react'

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


const CreateEntityMutation = graphql(`
mutation CreateEntity($name: String!, $pluralizedName: String!) {
  createEntity(name: $name, pluralizedName: $pluralizedName) {
    name
  }
}
`)

const EntityList = () => {
  const [{ data }, refetch] = useQuery({
    query: GetEntitiesQuery,
    variables: {},
  })


  const [, createEntityMutation] = useMutation(CreateEntityMutation)

  const onAddEntity = useCallback(async () => {
    const name = prompt('Create new entity, give it a name:', '')
    if (name) {
      await createEntityMutation({ name, pluralizedName: `${name}s` })
      // @ts-expect-error fix later
      router.push(`/${name}`)
      refetch()
    }
  }, [createEntityMutation, refetch])

  return (
    <View>
      {
        data?.getAllEntities.map((entity) => (
          <View key={entity.name} style={Styles.margin16}>
            <Button
              onPress={() => {
                // @ts-expect-error fix later
                router.push(`/${entity.pluralizedName}`)
              }}
              mode='contained'
            >
              {capitalize(pluralize(entity.name))}
            </Button>
          </View>
        ))
      }
      <Button mode='outlined' icon='plus' style={Styles.margin16} onPress={onAddEntity}>Add content type</Button>
    </View>
  )
}

export default EntityList
