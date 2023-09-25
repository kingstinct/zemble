import UrqlProvider from 'readapt-plugin-urql-expo/contexts/UrqlProvider'

import { SimpleAnonymousAuthProvider } from './Auth'

import type { PropsWithChildren } from 'react'

const PluginProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <UrqlProvider>
    <SimpleAnonymousAuthProvider>
      {children}
    </SimpleAnonymousAuthProvider>
  </UrqlProvider>
)

export default PluginProvider
