import { useCallback, useEffect, useRef } from 'react'

type CallbackFn = () => unknown;

export const useRunIfMounted = (): (cb: CallbackFn) => void => {
  const mountedRef = useRef<boolean>(false)

  // Basically the same as "useDidMount" because it has no dependencies
  useEffect(() => {
    mountedRef.current = true

    return () => {
      // The cleanup function of useEffect is called by React on unmount
      mountedRef.current = false
    }
  }, [])

  const runIfMounted = useCallback((cb: CallbackFn) => {
    if (mountedRef.current) {
      cb()
    }
  }, [])

  return runIfMounted
}

export default useRunIfMounted
