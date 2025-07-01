import UrqlProvider from '@zemble/urql-expo/contexts/UrqlProvider'
import type { PropsWithChildren } from 'react'
import { SimpleAnonymousAuthProvider } from './Auth'

const PluginProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <UrqlProvider>
    <SimpleAnonymousAuthProvider>{children}</SimpleAnonymousAuthProvider>
  </UrqlProvider>
)

export default PluginProvider
