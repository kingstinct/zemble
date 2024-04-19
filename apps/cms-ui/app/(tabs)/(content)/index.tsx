import { Styles } from '@zemble/react'
import { router } from 'expo-router'
import { useCallback } from 'react'
import { RefreshControl, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from 'react-native-paper'
import { useMutation, useQuery } from 'urql'

import { graphql } from '../../../gql.generated'
import { capitalize, pluralize } from '../../../utils/text'

export const GetEntitiesQuery = graphql(`
  query GetEntities {
    getAllEntities {
      nameSingular
      namePlural
      fields {
        name
        isRequired
      }
    }
  }
`)

const CreateEntityMutation = graphql(`
mutation CreateEntity($nameSingular: String, $namePlural: String!) {
  createEntity(nameSingular: $nameSingular, namePlural: $namePlural) {
    nameSingular
  }
}
`)

const EntityList = () => {
  const [{ data, fetching }, refetch] = useQuery({
    query: GetEntitiesQuery,
    variables: {},
  })

  const [, createEntityMutation] = useMutation(CreateEntityMutation)

  const onAddEntity = useCallback(async () => {
    const namePlural = prompt('Create new entity, give it a name (plural):', '')
    if (namePlural) {
      await createEntityMutation({ namePlural })
      // @ts-expect-error fix later
      router.push(`/${namePlural}`)
      refetch()
    }
  }, [createEntityMutation, refetch])

  return (
    <ScrollView refreshControl={<RefreshControl onRefresh={refetch} refreshing={fetching} />}>
      {
        data?.getAllEntities.map((entity) => (
          <View key={entity.nameSingular} style={Styles.margin16}>
            <Button
              onPress={() => {
                // @ts-expect-error fix later
                router.push(`/${entity.namePlural}`)
              }}
              mode='contained'
            >
              {capitalize(pluralize(entity.nameSingular))}
            </Button>
          </View>
        ))
      }
      <Button mode='outlined' icon='plus' style={Styles.margin16} onPress={onAddEntity}>Add content type</Button>
    </ScrollView>
  )
}

export default EntityList
