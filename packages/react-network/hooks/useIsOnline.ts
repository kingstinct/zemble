import type { NetInfoChangeHandler } from '@react-native-community/netinfo'
import NetInfo from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'

export const useIsOnline = (): boolean => {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const updateNetwork: NetInfoChangeHandler = (networkState) => {
      setIsOnline(
        (networkState.isConnected &&
          networkState.isInternetReachable !== false) ||
          false,
      )
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
  }, [])

  return isOnline
}

export default useIsOnline
