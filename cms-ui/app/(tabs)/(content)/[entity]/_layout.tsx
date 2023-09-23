import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Stack, router } from 'expo-router'
import { useCallback } from 'react'
import { Pressable } from 'react-native'

import { capitalize } from '../../../../utils/text'

const EntitiesLayout = () => (
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
            onPress={() => router.setParams({ create: 'true' })}
          />
        </Pressable>
      ), []),
    }}
  >
    <Stack.Screen
      name='schema'
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options={({ route }) => ({ title: `${capitalize(route.params.entity)} Schema` })}
    />
    <Stack.Screen
      name='index'
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options={({ route }) => ({ title: capitalize(route.params.entity) })}
    />
  </Stack>
)

export default EntitiesLayout
