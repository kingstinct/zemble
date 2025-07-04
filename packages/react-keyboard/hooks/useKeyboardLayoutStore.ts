import { Keyboard } from 'react-native'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface KeyboardLayoutStore {
  // these properties are exposes through individual hooks
  readonly isKeyboardShown: boolean
  readonly keyboardHeight: number
  readonly willKeyboardBeShown: boolean

  // modifiers
  readonly setKeyboardVisible: () => void
  readonly setKeyboardHidden: () => void
  readonly setKeyboardHeight: (height: number) => void
  readonly setWillKeyboardBeShown: () => void
  readonly setWillKeyboardBeHidden: () => void
}

/**
 * This zustand store is used to keep track of the keyboard layout.
 *
 * Prefer using the individual hooks
 * {@link useIsKeyboardShown}, {@link useKeyboardHeight}, {@link useWillKeyboardBeShown}
 * over this directly.
 */
export const useKeyboardLayoutStore = create<KeyboardLayoutStore>()(
  devtools(
    (set) => {
      Keyboard.addListener('keyboardDidShow', (event) => set({
        isKeyboardShown: true,
        keyboardHeight: event.endCoordinates.height,
      }))
      Keyboard.addListener('keyboardDidHide', () => set({ isKeyboardShown: false }))
      Keyboard.addListener('keyboardWillShow', () => set({ willKeyboardBeShown: true }))
      Keyboard.addListener('keyboardWillHide', () => set({ willKeyboardBeShown: false }))

      return {
        isKeyboardShown: false,
        keyboardHeight: 0,
        willKeyboardBeShown: false,
        setKeyboardVisible: () => set({ isKeyboardShown: true }),
        setKeyboardHidden: () => set({ isKeyboardShown: false }),
        setKeyboardHeight: (height) => set({ keyboardHeight: height }),
        setWillKeyboardBeShown: () => set({ willKeyboardBeShown: true }),
        setWillKeyboardBeHidden: () => set({ willKeyboardBeShown: false }),
      }
    },
  ),
)

export default useKeyboardLayoutStore
