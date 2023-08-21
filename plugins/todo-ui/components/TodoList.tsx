
import {useContext} from 'react'
import {View} from 'react-native'
import AuthContext from 'readapt-plugin-anonymous-auth-expo/contexts/Auth';
import {useQuery} from 'urql'
import { graphql } from '../gql';
import TodoListItem from './TodoListItem';
import TodoCreate from './TodoCreate';


const AllTodos = graphql(/* GraphQL */ `
  query AllTodos($token: String!) {
    todos(token: $token) {
      id
      title
      completed
    }
  }
`)



const AllTodoList = () => {
  const { token } = useContext(AuthContext)
  const [{data}, refetch] = useQuery({
    query: AllTodos,
    variables: { token: token! },
    pause: !token
  })
  return <View>
    { data?.todos.map((todo) => <TodoListItem key={todo.id} todo={todo} refetch={refetch} />) }
    <TodoCreate refetch={refetch} />
  </View>
}

export default AllTodoList