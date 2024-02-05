import { useEffect, useState } from 'react'
import { AppState } from 'react-native'

import type { AppStateStatus } from 'react-native'

export const getCurrentState = (): AppStateStatus => AppState.currentState

export const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState)

  useEffect(() => {
    const listener = setAppState

    const subscription = AppState.addEventListener('change', listener)

    return () => subscription.remove()
  }, [])

  return appState
}

export default useAppState
