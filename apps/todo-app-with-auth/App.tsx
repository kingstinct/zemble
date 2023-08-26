import LoginButton from 'plugins/anonymous-auth-expo/components/LoginButton'
import { LogoutButton } from 'plugins/anonymous-auth-expo/components/LogoutButton'
import { ShowForAuthenticated } from 'readapt-plugin-anonymous-auth-expo/components/ShowForAuthenticated'
import { ShowForUnauthenticated } from 'readapt-plugin-anonymous-auth-expo/components/ShowForUnauthenticated'
import PluginProvider from 'readapt-plugin-anonymous-auth-expo/contexts/Plugin'
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
