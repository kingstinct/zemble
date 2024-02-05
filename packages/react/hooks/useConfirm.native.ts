import { useCallback, useContext } from 'react'
import { Alert } from 'react-native'

import StringsContext from '../contexts/Strings'

export function useConfirm() {
  const { Cancel, OK } = useContext(StringsContext)

  return useCallback(async (title: string, message?: string) => new Promise<boolean>((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: Cancel, onPress: () => resolve(false), style: 'cancel' },
        { text: OK, onPress: () => resolve(true) },
      ],
      { cancelable: false },
    )
  }), [Cancel, OK])
}

export default useConfirm
