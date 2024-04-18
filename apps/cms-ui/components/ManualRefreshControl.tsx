import { useCallback, useEffect, useRef } from 'react'
import { RefreshControl } from 'react-native-gesture-handler'

const ManualRefreshControl = ({ fetching, refetch }: { readonly fetching: boolean, readonly refetch: () => void }) => {
  const manualRefresh = useRef(false)

  const onRefresh = useCallback(() => {
    manualRefresh.current = true
    refetch()
  }, [refetch])

  useEffect(() => {
    if (!fetching) {
      manualRefresh.current = false
    }
  }, [fetching])

  return (
    <RefreshControl
      refreshing={fetching && manualRefresh.current}
      onRefresh={onRefresh}
    />
  )
}

export default ManualRefreshControl
