import { Button, Text, View } from 'react-native'
import { useMutation } from 'urql'

import { graphql } from '../gql'

import type { AllTodosQuery } from '../gql/graphql'

const CompleteTodo = graphql(/* GraphQL */ `
  mutation CompleteTodo($completed: Boolean!, $id: ID!) {
    updateTodoStatus(completed: $completed, id: $id) {
      id
      title
      completed
    }
  }
`)

const TodoListItem: React.FC<{readonly todo: AllTodosQuery['todos'][0], readonly refetch: () => void}> = ({ todo, refetch }) => {
  const [, completeTodo] = useMutation(CompleteTodo)

  return (
    <View>
      <Text>{todo.title}</Text>
      <Button
        key={todo.id}
        title={todo.completed ? 'Completed' : 'Not completed'}
        onPress={() => {
          void completeTodo({ id: todo.id, completed: !todo.completed }).then(() => {
            refetch()
          })
        }}
      />
    </View>
  )
}

export default TodoListItem
