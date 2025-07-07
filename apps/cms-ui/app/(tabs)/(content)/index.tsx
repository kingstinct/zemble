import { Styles } from '@zemble/react'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import { RefreshControl, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, Dialog, Portal, TextInput } from 'react-native-paper'
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
  const [dialogVisible, setDialogVisible] = useState(false)
  const [entityName, setEntityName] = useState('')

  const onAddEntity = useCallback(async () => {
    if (entityName.trim()) {
      await createEntityMutation({ namePlural: entityName.trim() })
      router.push(`/${entityName.trim()}`)
      refetch()
      setEntityName('')
      setDialogVisible(false)
    }
  }, [createEntityMutation, refetch, entityName])

  const showDialog = useCallback(() => setDialogVisible(true), [])
  const hideDialog = useCallback(() => {
    setDialogVisible(false)
    setEntityName('')
  }, [])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={refetch} refreshing={fetching} />
      }
    >
      {data?.getAllEntities.map((entity) => (
        <View key={entity.nameSingular} style={Styles.margin16}>
          <Button
            onPress={() => {
              router.push(`/${entity.namePlural}`)
            }}
            mode='contained'
          >
            {capitalize(pluralize(entity.nameSingular))}
          </Button>
        </View>
      ))}
      <Button
        mode='outlined'
        icon='plus'
        style={Styles.margin16}
        onPress={showDialog}
      >
        Add content type
      </Button>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Create New Entity</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label='Entity name (plural)'
              value={entityName}
              onChangeText={setEntityName}
              placeholder='e.g., posts, users, products'
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={onAddEntity} mode='contained'>
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  )
}

export default EntityList
