import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  Stack, router, useGlobalSearchParams,
} from 'expo-router'
import { useCallback } from 'react'
import { Pressable } from 'react-native'
import { useMutation, useQuery } from 'urql'

import { GetEntitiesQuery } from '.'
import { graphql } from '../../../gql'
import { capitalize, singularize } from '../../../utils/text'

import type { HeaderButtonProps } from '@react-navigation/native-stack/src/types'

const CreateEntityMutation = graphql(`
mutation CreateEntity($name: String!, $pluralizedName: String!) {
  createEntity(name: $name, pluralizedName: $pluralizedName) {
    name
  }
}
`)

// eslint-disable-next-line camelcase
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
}

const HeaderRightButton = ({ onPress, tintColor }: HeaderButtonProps & { readonly onPress: () => void }) => (
  <Pressable accessibilityRole='button'>
    <MaterialCommunityIcons
      name='plus'
      size={24}
      style={{ marginRight: 16 }}
      color={tintColor}
      onPress={onPress}
    />
  </Pressable>
)

const EntitiesLayout = () => {
  const { entity } = useGlobalSearchParams()
  const [, createEntityMutation] = useMutation(CreateEntityMutation)

  const [, refetch] = useQuery({ query: GetEntitiesQuery, pause: true })

  const onAddEntity = useCallback(async () => {
    const name = prompt('Create new entity, give it a name:', '')
    if (name) {
      await createEntityMutation({ name, pluralizedName: `${name}s` })
      // @ts-expect-error fix later
      router.push(`/${name}`)
      refetch()
    }
  }, [createEntityMutation, refetch])

  const headerRightForListView = useCallback((props: HeaderButtonProps) => (
    <HeaderRightButton {...props} onPress={() => router.push(`/(tabs)/(content)/${entity}/create`)} />
  ), [entity])

  const headerRightForContentView = useCallback((props: HeaderButtonProps) => (
    <HeaderRightButton {...props} onPress={onAddEntity} />
  ), [onAddEntity])

  const headerRightForSchemaView = useCallback((props: HeaderButtonProps) => (
    <HeaderRightButton {...props} onPress={() => router.push(`/(tabs)/(content)/${entity}/schema/addField`)} />
  ), [entity])

  return (
    <Stack
      initialRouteName='index'
      screenOptions={{
        animationTypeForReplace: 'pop',
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: 'Content',
          headerRight: headerRightForContentView,
        }}
      />
      {/* <Stack.Screen
        name='[entity]'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={{
          headerShown: false,
        }}
      /> */}
      <Stack.Screen
        name='[entity]/index'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={({ route }) => ({
          title: route.params?.entity ? capitalize(route.params.entity) : null,
          headerRight: headerRightForListView,
        })}
      />
      <Stack.Screen
        name='[entity]/create'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={({ route }) => ({
          title: route.params?.entity ? `Create ${singularize(route.params.entity)}` : null,
          presentation: 'modal',
          headerRight: undefined,
        })}
      />
      <Stack.Screen
        name='[entity]/edit/[id]'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={({ route }) => ({
          title: route.params?.entity ? `Edit ${singularize(route.params.entity)}` : null,
          presentation: 'modal',
          headerRight: undefined,
        })}
      />
      <Stack.Screen
        name='[entity]/schema/index'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={({ route }) => ({
          title: route.params?.entity ? `${capitalize(route.params.entity)} Schema` : null,
          headerRight: headerRightForSchemaView,
        })}
      />

      <Stack.Screen
        name='[entity]/schema/addField'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={({ route }) => ({
          title: route.params?.entity ? `Add field to ${singularize(capitalize(route.params.entity))}` : null,
        })}
      />
    </Stack>
  )
}

export default EntitiesLayout
