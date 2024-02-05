import useSnackbarStore from './useSnackbarStore'

export function useRemoveSnackbar() {
  return useSnackbarStore((state) => state.removeSnackbar)
}

export default useRemoveSnackbar
