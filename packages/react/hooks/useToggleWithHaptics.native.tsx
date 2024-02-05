import { useCallback, useState } from 'react'

import doHaptics from '../utils/doHaptics'

export function useToggleWithHaptics(initialValue = false, enableHaptics: boolean | undefined = undefined) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    void doHaptics(enableHaptics)
    setValue((prev) => !prev)
  }, [enableHaptics])

  return [value, toggle] as const
}

export default useToggleWithHaptics
