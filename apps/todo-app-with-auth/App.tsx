import LoginButton from 'zemble-plugin-auth-anonymous-expo/components/LoginButton'
import { ShowForAuthenticated } from 'zemble-plugin-auth-anonymous-expo/components/ShowForAuthenticated'
import { ShowForUnauthenticated } from 'zemble-plugin-auth-anonymous-expo/components/ShowForUnauthenticated'
import PluginProvider from 'zemble-plugin-auth-anonymous-expo/contexts/Plugin'
import { LogoutButton } from 'zemble-plugin-auth-expo/components/LogoutButton'
import TodoList from 'zemble-plugin-todo-ui/components/TodoList'

export default function App() {
  return (
    <PluginProvider>
      <ShowForUnauthenticated>
        <LoginButton />
      </ShowForUnauthenticated>
      <ShowForAuthenticated>
        <LogoutButton />
        <TodoList />
      </ShowForAuthenticated>
    </PluginProvider>
  )
}
