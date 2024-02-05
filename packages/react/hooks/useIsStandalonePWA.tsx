import { useState, useEffect } from 'react'

export const useIsStandalonePWA = () => {
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    const matcher = window.matchMedia('(display-mode: standalone)')
    const isStandalone = matcher.matches
    setIsPWA(isStandalone)
    const callback = (evt: MediaQueryListEvent) => {
      setIsPWA(evt.matches)
    }
    if (matcher.addEventListener) {
      matcher.addEventListener('change', callback)
    } else if (matcher.addListener) {
      matcher.addListener(callback)
    }
    return () => {
      if (matcher.removeEventListener) {
        matcher.removeEventListener('change', callback)
      } else if (matcher.removeListener) {
        matcher.removeListener(callback)
      }
    }
  }, [])

  return isPWA
}

export default useIsStandalonePWA
