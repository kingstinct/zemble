import useSnackbarStore from './useSnackbarStore'

export function useSnackbarsToShow() {
  return useSnackbarStore((state) => state.snackbarsToShow)
}

export default useSnackbarsToShow
