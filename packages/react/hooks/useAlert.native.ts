import { useCallback, useContext } from 'react'
import { Alert } from 'react-native'

import StringsContext from '../contexts/Strings'

export function useAlert() {
  const { OK } = useContext(StringsContext)

  return useCallback(async (title: string, message?: string) => new Promise<void>((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: OK,
          onPress: () => resolve(),
        },
      ],
    )
  }), [OK])
}

export default useAlert
