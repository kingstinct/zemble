import LoginButton from 'plugins/anonymous-auth-expo/components/LoginButton';
import { OnlyVisibleForAuthenticated } from 'readapt-plugin-anonymous-auth-expo/contexts/Auth';
import PluginProvider from 'readapt-plugin-anonymous-auth-expo/contexts/Plugin';
import TodoList from 'readapt-plugin-todo-ui/components/TodoList';

export default function App() {
  return (
    <PluginProvider>      
      <LoginButton />
      <OnlyVisibleForAuthenticated>
        <TodoList />
      </OnlyVisibleForAuthenticated>
    </PluginProvider>
  );
}
