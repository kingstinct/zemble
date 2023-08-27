
import {useContext, useState} from 'react'
import {Button, TextInput, View} from 'react-native'
import AuthContext from 'readapt-plugin-auth-anonymous-expo/contexts/Auth';
import {useMutation, useQuery} from 'urql'
import { graphql } from '../gql';

const CreateTodo = graphql(/* GraphQL */ `
  mutation CreateTodo($token: String!, $title: String!) {
    createTodo(token: $token, title: $title) {
      id
      title
      completed
    }
  }
`)

const TodoCreate: React.FC<{refetch: () => void}> = ({ refetch }) => {
  const { token } = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [, createTodo] = useMutation(CreateTodo)
  
  return <View>
    <TextInput placeholder="Add a new todo" value={title} onChangeText={setTitle}  />
    <Button title="Add" onPress={() => {
      createTodo({ title, token: token! }).then(() => {
        setTitle('')
        refetch()
      })
    }} />
  </View>
}

export default TodoCreate