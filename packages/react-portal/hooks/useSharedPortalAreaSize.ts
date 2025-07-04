import useSharedPortalAreaStore from './useSharedPortalAreaStore'

export const useSharedPortalAreaSize = () => useSharedPortalAreaStore((state) => state.size)

export default useSharedPortalAreaSize
