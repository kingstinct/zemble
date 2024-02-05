import React, { useCallback, useState } from 'react'
import {
  RefreshControl,
} from 'react-native'

import type { RefreshControlProps } from 'react-native'

type Props<T = unknown> = Omit<RefreshControlProps, 'onRefresh' | 'refreshing'> & {
  readonly onRefetch: (() => Promise<T> | T) | undefined,
  readonly onStatusChange?: (isLoading: boolean) => void,
}

export const RefetchControl = React.forwardRef<RefreshControl, Props>(function RefetchControl({
  onRefetch, onStatusChange, ...props
}, ref) {
  const [isRefetching, setIsRefetching] = useState(false)
  const onRefetchWithPull = useCallback(async () => {
    setIsRefetching(true)
    onStatusChange?.(true)

    try {
      if (onRefetch) {
        await onRefetch()
      }
    } finally {
      setIsRefetching(false)
      onStatusChange?.(false)
    }
  }, [onRefetch, onStatusChange])

  return (
    <RefreshControl
      ref={ref}
      {...props}
      refreshing={isRefetching}
      onRefresh={onRefetchWithPull}
    />
  )
})

export default RefetchControl
