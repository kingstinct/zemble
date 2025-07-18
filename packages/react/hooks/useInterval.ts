import { useEffect, useRef } from 'react'

type Delay = number | null
type TimerHandler = (...args: readonly unknown[]) => void

/**
 * Provides a declarative useInterval
 *
 * @param callback - Function that will be called every `delay` ms.
 * @param delay - Number representing the delay in ms. Set to `null` to "pause" the interval.
 */

export const useInterval = (callback: TimerHandler, delay: Delay) => {
  const savedCallbackRef = useRef<TimerHandler>(callback)

  useEffect(() => {
    savedCallbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handler = (...args: readonly unknown[]) =>
      savedCallbackRef.current?.(...args)

    if (delay !== null) {
      const intervalId = setInterval(handler, delay)
      return () => clearInterval(intervalId)
    }
    return () => {}
  }, [delay])
}

export default useInterval
