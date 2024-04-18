import LoginButton from '@zemble/auth-anonymous-expo/components/LoginButton'
import { ShowForAuthenticated } from '@zemble/auth-anonymous-expo/components/ShowForAuthenticated'
import { ShowForUnauthenticated } from '@zemble/auth-anonymous-expo/components/ShowForUnauthenticated'
import PluginProvider from '@zemble/auth-anonymous-expo/contexts/Plugin'
import { LogoutButton } from '@zemble/auth-expo/components/LogoutButton'
import TodoList from '@zemble/todo-ui/components/TodoList'

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
