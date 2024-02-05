import useKeyboardLayoutStore from './useKeyboardLayoutStore'

export function useIsKeyboardShown() {
  return useKeyboardLayoutStore((state) => state.isKeyboardShown)
}

export default useIsKeyboardShown
