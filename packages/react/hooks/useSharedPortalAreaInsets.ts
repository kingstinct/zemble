import useSharedPortalAreaStore from './useSharedPortalAreaStore'

export const useSharedPortalAreaInsets = () => useSharedPortalAreaStore((state) => state.insets)

export default useSharedPortalAreaInsets
