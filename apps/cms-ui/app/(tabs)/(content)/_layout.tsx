import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
  Stack, router, useGlobalSearchParams,
} from 'expo-router'
import { useCallback } from 'react'
import { Pressable } from 'react-native'


import { capitalize, singularize } from '../../../utils/text'

import type { HeaderButtonProps } from '@react-navigation/native-stack/src/types'
import { useTheme } from 'react-native-paper'



// eslint-disable-next-line camelcase
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
}

const HeaderRightButton = ({ onPress, tintColor, icon = 'plus' }: HeaderButtonProps & { readonly onPress: () => void, icon?: string }) => {
  const theme = useTheme()
  return (
    <Pressable accessibilityRole='button' onPress={onPress}>
      <MaterialCommunityIcons
        // @ts-ignore
        name={icon}
        size={24}
        style={{ marginRight: 16 }}
        color={tintColor ?? theme.colors.onSurface}
      />
    </Pressable>
  )
} 

const EntitiesLayout = () => {
  const { entity } = useGlobalSearchParams()  

  const headerRightForListView = useCallback((props: HeaderButtonProps) => (
    <HeaderRightButton {...props} icon='cog' onPress={() => router.push(`/(tabs)/(content)/${entity as string}/schema`)} />
  ), [entity])

  const headerRightForSchemaView = useCallback((props: HeaderButtonProps) => (
    <HeaderRightButton {...props} onPress={() => router.push(`/(tabs)/(content)/${entity}/schema/fields/create`)} />
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={({ route }) => ({
          title: 'Content',
        })}
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
          title: route.params?.entity ? `${singularize(capitalize(route.params.entity))} Schema` : null,
          headerRight: headerRightForSchemaView,
        })}
      />

      <Stack.Screen
        name='[entity]/schema/fields/create'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={({ route }) => ({
          title: 'Add field',
          presentation: 'modal',
        })}
      />

      <Stack.Screen
        name='[entity]/schema/fields/[fieldName]'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={({ route }) => ({
          title: 'Update field ' + route.params?.fieldName,
          presentation: 'modal',
        })}
      />
    </Stack>
  )
}

export default EntitiesLayout
