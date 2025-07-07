import useKeyboardLayoutStore from './useKeyboardLayoutStore'

export function useWillKeyboardBeShown() {
  return useKeyboardLayoutStore((state) => state.willKeyboardBeShown)
}

export default useWillKeyboardBeShown
