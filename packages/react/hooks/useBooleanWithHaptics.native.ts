import * as Haptics from 'expo-haptics'
import { useCallback, useState } from 'react'
import { Platform } from 'react-native'

export function useBooleanWithHaptics(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const on = useCallback(() => {
    if (Platform.OS === 'ios') {
      void Haptics.selectionAsync()
    }
    setValue(true)
  }, [])

  const off = useCallback(() => {
    if (Platform.OS === 'ios') {
      void Haptics.selectionAsync()
    }
    setValue(false)
  }, [])

  return [value, on, off] as const
}

export default useBooleanWithHaptics
