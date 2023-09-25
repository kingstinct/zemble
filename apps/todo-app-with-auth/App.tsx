import LoginButton from 'readapt-plugin-auth-anonymous-expo/components/LoginButton'
import { ShowForAuthenticated } from 'readapt-plugin-auth-anonymous-expo/components/ShowForAuthenticated'
import { ShowForUnauthenticated } from 'readapt-plugin-auth-anonymous-expo/components/ShowForUnauthenticated'
import PluginProvider from 'readapt-plugin-auth-anonymous-expo/contexts/Plugin'
import { LogoutButton } from 'readapt-plugin-auth-expo/components/LogoutButton'
import TodoList from 'readapt-plugin-todo-ui/components/TodoList'

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
