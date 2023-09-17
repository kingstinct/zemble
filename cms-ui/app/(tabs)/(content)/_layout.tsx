import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Stack, router } from 'expo-router'
import { useCallback } from 'react'
import { Pressable } from 'react-native'
import { useMutation, useQuery } from 'urql'

import { GetEntitiesQuery } from '.'
import { graphql } from '../../../gql'
import { capitalize } from '../../../utils/text'

const CreateEntityMutation = graphql(`
mutation CreateEntity($name: String!, $pluralizedName: String!) {
  createEntity(name: $name, pluralizedName: $pluralizedName) {
    name
  }
}
`)

const EntitiesLayout = () => {
  const [, createEntityMutation] = useMutation(CreateEntityMutation)

  const [, refetch] = useQuery({ query: GetEntitiesQuery, pause: true })

  const onAddEntity = useCallback(async () => {
    const name = prompt('Create new entity, give it a name:', '')
    if (name) {
      await createEntityMutation({ name, pluralizedName: `${name}s` })
      router.push(`/${name}`)
      refetch()
    }
  }, [createEntityMutation, refetch])

  return (
    <Stack
      screenOptions={{
        animation: 'flip',
        animationTypeForReplace: 'pop',
        headerRight: useCallback(({ canGoBack, tintColor }) => (
          <Pressable accessibilityRole='button'>
            <MaterialCommunityIcons
              name='plus'
              size={24}
              style={{ marginRight: 16 }}
              color={tintColor}
              onPress={onAddEntity}
            />
          </Pressable>
        ), [onAddEntity]),
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: 'Content',
        }}
      />
      <Stack.Screen
        name='[entity]'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={({ route }) => ({ title: capitalize(route.params.entity), headerRight: null })}
      />
    </Stack>
  )
}

export default EntitiesLayout
