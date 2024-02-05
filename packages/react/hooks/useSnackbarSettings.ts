import { useEffect } from 'react'

import useSnackbarStore from './useSnackbarStore'

interface SnackbarSettings {
  /** Default value is 5000 ms */
  readonly defaultTimeoutMs?: number
  /** Default value is 1 */
  readonly snackbarsToShowAtSameTime?: number
}

export const useSnackbarSettings = (settings: SnackbarSettings) => {
  const setDefaultTimeoutMs = useSnackbarStore((state) => state.setDefaultTimeoutMs)
  const setSnackbarsToShowAtSameTime = useSnackbarStore((state) => state.setSnackbarsToShowAtSameTime)

  useEffect(() => {
    if (settings.defaultTimeoutMs != null) setDefaultTimeoutMs(settings.defaultTimeoutMs)
  }, [setDefaultTimeoutMs, settings.defaultTimeoutMs])

  useEffect(() => {
    if (settings.snackbarsToShowAtSameTime != null) setSnackbarsToShowAtSameTime(settings.snackbarsToShowAtSameTime)
  }, [setSnackbarsToShowAtSameTime, settings.snackbarsToShowAtSameTime])
}

export default useSnackbarSettings
