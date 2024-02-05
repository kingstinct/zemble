import { Portal } from '@gorhom/portal'
import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'

import randomHexColorAlpha from '../utils/randomHexColor'

import type { Props } from './NativePortal.types'
import type { StyleProp, ViewStyle } from 'react-native'

export const NativePortal: React.FC<Props> = ({
  children, pointerEvents = 'box-none', insets, colorize,
}) => {
  const style = useMemo<StyleProp<ViewStyle>>(() => [
    StyleSheet.absoluteFill,
    { justifyContent: 'flex-end' },
    insets,
    { backgroundColor: colorize ? randomHexColorAlpha() : undefined },
  ], [insets, colorize])

  return (
    <Portal>
      <FullWindowOverlay
        // @ts-expect-error not sure why this is happening
        pointerEvents={pointerEvents as unknown}
        style={style}
      >
        { children }
      </FullWindowOverlay>
    </Portal>
  )
}
export default NativePortal
