import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

const TabsLayout = () => (
  <Tabs
    screenOptions={{
      headerShown: true,
    }}
  >
    <Tabs.Screen
      name='(content)'
      options={{
        title: 'Content',
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='text' size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name='users'
      options={{
        title: 'Users',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name='account-group'
            size={size}
            color={color}
          />
        ),
      }}
    />
    <Tabs.Screen
      name='profile'
      options={{
        title: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='account' size={size} color={color} />
        ),
      }}
    />
  </Tabs>
)

export default TabsLayout
