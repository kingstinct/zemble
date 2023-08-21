import { PropsWithChildren } from 'react'

import UrqlProvider from 'readapt-plugin-urql-expo/contexts/UrqlProvider';
import { SimpleAnonymousAuthProvider } from './Auth';

const PluginProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <UrqlProvider>
    <SimpleAnonymousAuthProvider>
      {children}
    </SimpleAnonymousAuthProvider>
  </UrqlProvider>
}

export default PluginProvider