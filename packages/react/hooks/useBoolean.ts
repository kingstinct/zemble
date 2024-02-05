import { useCallback, useState } from 'react'

export function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const on = useCallback(() => setValue(true), [])

  const off = useCallback(() => setValue(false), [])

  return [value, on, off] as const
}

export default useBoolean
