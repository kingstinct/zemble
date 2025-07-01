import useSnackbarStore from './useSnackbarStore'

export function useSnackbarWasPresented() {
  return useSnackbarStore((state) => state.snackbarWasPresented)
}

export default useSnackbarWasPresented
