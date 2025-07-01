import { useState } from 'react'
import { Button, TextInput, View } from 'react-native'
import { useMutation } from 'urql'

import { graphql } from '../gql.generated'

const CreateTodo = graphql(/* GraphQL */ `
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
    }
  }
`)

const TodoCreate: React.FC<{ readonly refetch: () => void }> = ({ refetch }) => {
  // const { token } = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [, createTodo] = useMutation(CreateTodo)

  return (
    <View>
      <TextInput accessibilityLabel='Text input field' placeholder='Add a new todo' value={title} onChangeText={setTitle} accessibilityHint='Enter a title for the todo item' />
      <Button
        title='Add'
        onPress={() => {
          void createTodo({ title }).then(() => {
            setTitle('')
            refetch()
          })
        }}
      />
    </View>
  )
}

export default TodoCreate
