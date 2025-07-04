import { View } from 'react-native'
import { useQuery } from 'urql'
import { graphql } from '../gql.generated'
import TodoCreate from './TodoCreate'
import TodoListItem from './TodoListItem'

const AllTodos = graphql(/* GraphQL */ `
  query AllTodos {
    todos {
      id
      title
      completed
    }
  }
`)

const AllTodoList = () => {
  // const { token } = useContext(AuthContext)
  const [{ data }, refetch] = useQuery({
    query: AllTodos,
    variables: {},
    // pause: !token,
  })
  return (
    <View>
      {data?.todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} refetch={refetch} />
      ))}
      <TodoCreate refetch={refetch} />
    </View>
  )
}

export default AllTodoList
