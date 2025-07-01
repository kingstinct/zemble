import { useEffect } from 'react'
import type { Insets } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import generateId from '../utils/generateId'
import useSharedPortalAreaStore from './useSharedPortalAreaStore'

/**
 * Set insets, but with safe area as default
 */
export const useUpdateSharedPortalSafeAreaInsets = (insets: Insets, enable = true) => {
  const safeAreaInsets = useSafeAreaInsets()
  const pushInset = useSharedPortalAreaStore((state) => state.pushInset)
  const removeInset = useSharedPortalAreaStore((state) => state.removeInset)

  useEffect(() => {
    if (enable) {
      const id = generateId()
      pushInset({ ...safeAreaInsets, ...insets, id })
      return () => removeInset(id)
    }
    return () => {}
  }, [safeAreaInsets, insets, enable, pushInset, removeInset])
}

export default useUpdateSharedPortalSafeAreaInsets
