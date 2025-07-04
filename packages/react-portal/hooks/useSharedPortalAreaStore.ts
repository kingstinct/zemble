import { Dimensions } from 'react-native'
import { create } from 'zustand'

import type { LayoutRectangle, Insets } from 'react-native'

type InsetsWithId = Required<Insets> & { readonly id: string }

interface SharedPortalAreaStore {
  readonly allCustomInsets: readonly InsetsWithId[]
  readonly defaultInsets: Required<Insets>
  readonly setDefaultInsets: (defaultInsets: Required<Insets>) => void
  readonly insets: Required<Insets>
  readonly size: LayoutRectangle
  readonly pushInset: (insets: InsetsWithId) => void
  readonly removeInset: (id: string) => void
  readonly setSize: (size: LayoutRectangle) => void
}

function calculateInset(allCustomInsets: SharedPortalAreaStore['allCustomInsets'], defaultInsets: SharedPortalAreaStore['defaultInsets']) {
  // eslint-disable-next-line unicorn/prefer-at
  const lastInset = allCustomInsets[allCustomInsets.length - 1]
  return lastInset ? { ...defaultInsets, ...lastInset } : defaultInsets
}

/**
 * This zustand store is used to keep the state of the shared portal area.
 *
 * Prefer using the individual hooks
 * {@link useSharedPortalAreaInsets}
 * {@link useSharedPortalAreaSize}
 * {@link useUpdateSharedPortalAreaInsets}
 * {@link useUpdateSharedPortalSafeAreaInsets}
 * over this directly.
 */
export const useSharedPortalAreaStore = create<SharedPortalAreaStore>((set, get) => ({
  allCustomInsets: [],
  defaultInsets: {
    top: 0, bottom: 0, left: 0, right: 0,
  },
  setDefaultInsets: (defaultInsets: Required<Insets>) => set(() => ({
    defaultInsets,
    insets: calculateInset(get().allCustomInsets, defaultInsets),
  })),
  insets: {
    top: 0, bottom: 0, left: 0, right: 0,
  },
  size: {
    x: 0,
    y: 0,
    width: Dimensions.get('window').width,
    height: 0,
  },
  pushInset: (insets: InsetsWithId) => set((state) => {
    const allCustomInsets = [...state.allCustomInsets, insets]

    return {
      allCustomInsets,
      insets: calculateInset(allCustomInsets, state.defaultInsets),
    }
  }),
  removeInset: (id: string) => set((state) => {
    const allCustomInsets = state.allCustomInsets.filter(({ id: prevId }) => prevId !== id)

    return {
      allCustomInsets,
      insets: calculateInset(allCustomInsets, state.defaultInsets),
    }
  }),
  setSize: (size: LayoutRectangle) => set(() => ({ size })),
}))

export default useSharedPortalAreaStore
