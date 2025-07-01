import { PortalProvider } from '@gorhom/portal'
import type { PropsWithChildren } from 'react'
import React, { useEffect } from 'react'
import type { Insets } from 'react-native'
import useSharedPortalAreaStore from '../hooks/useSharedPortalAreaStore'

export interface SharedPortalAreaProviderProps {
  readonly insets?: Insets
}

export const SharedPortalAreaProvider: React.FC<PropsWithChildren<SharedPortalAreaProviderProps>> = ({ children, insets }) => {
  const setDefaultInsets = useSharedPortalAreaStore((state) => state.setDefaultInsets)

  useEffect(() => {
    setDefaultInsets({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      ...(insets ?? {}),
    })
  }, [insets, setDefaultInsets])

  return <PortalProvider>{children}</PortalProvider>
}

export default SharedPortalAreaProvider
