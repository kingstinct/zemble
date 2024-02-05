import { useEffect, useRef, useState } from 'react'

import type { AppStateStatus } from 'react-native'

const isPrefixed = !document.hasOwnProperty('hidden') && document.hasOwnProperty('webkitHidden') // eslint-disable-line no-prototype-builtins

const VISIBILITY_CHANGE_EVENT = isPrefixed ? 'webkitvisibilitychange' : 'visibilitychange'
const VISIBILITY_STATE_PROPERTY = isPrefixed ? 'webkitVisibilityState' : 'visibilityState'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const isAvailable = document[VISIBILITY_STATE_PROPERTY]

export const getCurrentState = (isFocused: boolean): AppStateStatus => {
  if (!isAvailable) {
    return isFocused ? 'active' : 'inactive'
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  switch (document[VISIBILITY_STATE_PROPERTY]) {
    case 'hidden':
    case 'prerender':
    case 'unloaded':
      return 'background'
    default:
      return isFocused ? 'active' : 'inactive'
  }
}

export const useAppState = () => {
  const [appState, setAppState] = useState(getCurrentState(document.hasFocus()))
  const isFocused = useRef(false)

  useEffect(() => {
    const onUpdate = () => setAppState(getCurrentState(isFocused.current))
    const onBlur = () => { isFocused.current = false; onUpdate() }
    const onFocus = () => { isFocused.current = true; onUpdate() }

    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    window.addEventListener(
      VISIBILITY_CHANGE_EVENT,
      onUpdate,
      false,
    )

    return () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener(VISIBILITY_CHANGE_EVENT, onUpdate)
    }
  }, [])

  return appState
}

export default useAppState
