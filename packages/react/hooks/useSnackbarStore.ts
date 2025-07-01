import { create } from 'zustand'

import getRandomID from '../utils/getRandomID'

export const DEFAULT_SNACKBAR_TIMOUT_MS = 5000
export const DEFAULT_SNACKBARS_TO_SHOW_AT_SAME_TIME = 1

export interface Action {
  readonly key?: string
  readonly label: string
  readonly onPress?: (action: Action) => void
}

export interface SnackbarConfig<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap> {
  readonly id?: string // unique id for the snackbar, to never show duplicates and
  readonly title: string
  readonly timeout?: number
  readonly actions?: ReadonlyArray<Action>
  readonly type?: T
  readonly onShow?: () => void
  readonly data?: TMap[T]
}

export interface SnackbarWithId {
  readonly snackbarConfig: SnackbarConfig
  readonly id: string
}

export type AddSnackbarFn = <TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap>(snackbarConfig: SnackbarConfig<TMap, T>) => void

interface SnackbarStore {
  readonly defaultTimeoutMs: number
  readonly setDefaultTimeoutMs: (timeout: number | undefined) => void
  readonly snackbarsToShowAtSameTime: number
  readonly setSnackbarsToShowAtSameTime: (value: number | undefined) => void

  readonly snackbars: readonly SnackbarWithId[]
  readonly snackbarsToShow: readonly SnackbarWithId[]

  readonly addSnackbar: AddSnackbarFn
  readonly removeSnackbar: (id: string) => void
  readonly snackbarWasPresented: (id: string) => void
}

let hasWarned = false
const timeouts = new Map<string, number>()

/**
 * This zustand store is used to keep the state of snackbars.
 *
 * Prefer using the individual hooks
 * {@link useSnackbarSettings}
 * {@link useSnackbarsToShow}
 * {@link useSnackbarWasPresented}
 * {@link useRemoveSnackbar}
 * over this directly.
 */
const useSnackbarStore = create<SnackbarStore>((set) => ({
  defaultTimeoutMs: DEFAULT_SNACKBAR_TIMOUT_MS,
  setDefaultTimeoutMs: (timeout) => set(() => ({ defaultTimeoutMs: timeout ?? DEFAULT_SNACKBAR_TIMOUT_MS })),
  snackbarsToShowAtSameTime: DEFAULT_SNACKBARS_TO_SHOW_AT_SAME_TIME,
  setSnackbarsToShowAtSameTime: (value) =>
    set((state) => {
      const snackbarsToShowAtSameTime = value ?? DEFAULT_SNACKBARS_TO_SHOW_AT_SAME_TIME

      return {
        snackbarsToShow: state.snackbars.slice(0, snackbarsToShowAtSameTime),
        snackbarsToShowAtSameTime,
      }
    }),
  snackbars: [],
  snackbarsToShow: [],
  addSnackbar: (snackbarConfig) =>
    set((state) => {
      const id = snackbarConfig.id || getRandomID()
      const snackbars = [
        ...state.snackbars.filter((s) => s.id !== id),
        {
          snackbarConfig: {
            ...snackbarConfig,
            type: snackbarConfig.type as never, // here is where type safety ends
            data: snackbarConfig.data as never,
          },
          id,
        },
      ]

      return {
        snackbars,
        snackbarsToShow: snackbars.slice(0, state.snackbarsToShowAtSameTime),
      }
    }),
  removeSnackbar: (id: string) =>
    set((state) => {
      const snackbars = state.snackbars.filter((s) => s.id !== id)

      return {
        snackbars,
        snackbarsToShow: snackbars.slice(0, state.snackbarsToShowAtSameTime),
      }
    }),
  snackbarWasPresented: (id: string) =>
    set((state) => {
      const snackbar = state.snackbars.find((s) => s.id === id)

      if (!timeouts.has(id)) {
        snackbar?.snackbarConfig.onShow?.()
        timeouts.set(
          id,
          setTimeout(() => {
            state.removeSnackbar(id)
            timeouts.delete(id)
          }, snackbar?.snackbarConfig.timeout || state.defaultTimeoutMs) as unknown as number,
        )
      }

      if (!hasWarned) {
        setTimeout(() => {
          if (timeouts.size === 0) {
            // eslint-disable-next-line no-console
            console.warn("[@zemble/react] Snackbar added but not shown, make sure SnackbarView is present (or that you're calling snackbarWasPresented if rolling your own).")
            hasWarned = true
          }
        }, 0)
      }

      return {}
    }),
}))

export default useSnackbarStore
