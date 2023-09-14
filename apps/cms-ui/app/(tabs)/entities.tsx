import { View, Text, Button } from 'react-native'
import { useMutation, useQuery } from 'urql'

import { graphql } from '../../gql'
import { useContext } from 'react'
import { AuthContext } from '@kingstinct/react'
import { router } from 'expo-router'

export const GetEntitiesQuery = graphql(`
  query GetEntities {
    entities {
      name
      fields {
        name
      }
    }
  }
`)

export const CreateEntityMutation = graphql(`
  mutation CreateEntity($name: String!) {
    createEntity(name: $name) {
      name
    }
  }
`)

const EntityList = () => {
  const {clearToken} = useContext(AuthContext)
  const [{ data }] = useQuery({
    query: GetEntitiesQuery,
    variables: {},
  })

  const [,createEntityMutation] = useMutation(CreateEntityMutation)

  const logout = () => {
    clearToken()
    router.replace('/login')
  }

  const createEntity = () => {
    const name = prompt('Entity name', '')
    if (name) {
      void createEntityMutation({ name })
    }
  }


  return (
    <View>
      <Button onPress={logout} title='Logout' />
      <Button onPress={createEntity} title='Create Entity' />
      <Button onPress={() => router.push('/users')} title='Users' />
      {
        data?.entities.map((entity) => <Button key={entity.name} title={entity.name} onPress={() => router.push('/entities/' + entity.name)} />)
      }
    </View>
  )
}

export default EntityList
