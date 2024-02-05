import NetInfo from '@react-native-community/netinfo'
import { useState, useEffect } from 'react'

import useRunIfMounted from './useRunIfMounted'

import type { NetInfoChangeHandler } from '@react-native-community/netinfo'

export const useIsOnline = (): boolean => {
  const [isOnline, setIsOnline] = useState(false),
        runIfMounted = useRunIfMounted()

  useEffect(() => {
    const updateNetwork: NetInfoChangeHandler = (networkState) => {
      runIfMounted(() => setIsOnline((networkState.isConnected && networkState.isInternetReachable !== false) || false))
    }

    const endNetworkSubscription = NetInfo.addEventListener(updateNetwork)
    const init = async (): Promise<void> => {
      const networkState = await NetInfo.fetch()

      updateNetwork(networkState)
    }

    void init()

    return () => {
      endNetworkSubscription()
    }
  }, [runIfMounted])

  return isOnline
}

export default useIsOnline
