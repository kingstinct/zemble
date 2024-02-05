import { useCallback, useState } from 'react'

export function useNullableState<T = unknown>(initialValue: T | null = null) {
  const [value, setValueInternal] = useState<T | null>(initialValue)

  const reset = useCallback(() => {
    setValueInternal(null)
  }, [])

  const setValue = useCallback((v: T) => {
    setValueInternal(v)
  }, [])

  return [value, setValue, reset] as const
}

export default useNullableState
