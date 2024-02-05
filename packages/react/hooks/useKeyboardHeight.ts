import useKeyboardLayoutStore from './useKeyboardLayoutStore'

/**
 * The height of the keyboard will not be reset to 0 when the keyboard is hidden,
 * use {@link useIsKeyboardShown} to check if the keyboard is currently shown.
 */
export function useKeyboardHeight() {
  return useKeyboardLayoutStore((state) => state.keyboardHeight)
}
