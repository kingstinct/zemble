import { useEffect } from 'react'

import useSharedPortalAreaStore from './useSharedPortalAreaStore'
import generateId from '../utils/generateId'

import type { Insets } from 'react-native'

export const useUpdateSharedPortalAreaInsets = (insets: Required<Insets>, enable = true) => {
  const pushInset = useSharedPortalAreaStore((state) => state.pushInset)

  const removeInset = useSharedPortalAreaStore((state) => state.removeInset)

  useEffect(() => {
    if (enable) {
      const id = generateId()
      pushInset({ ...insets, id })
      return () => removeInset(id)
    }
    return () => {}
  }, [
    enable, insets, pushInset, removeInset,
  ])
}

export default useUpdateSharedPortalAreaInsets
