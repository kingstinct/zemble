import { Portal } from '@gorhom/portal'
import React, { useMemo } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { StyleSheet, View } from 'react-native'
import randomHexColorAlpha from '../utils/randomHexColor'
import type { Props } from './NativePortal.types'

export const NativePortal: React.FC<Props> = ({
  children,
  pointerEvents = 'box-none',
  insets,
  colorize,
}) => {
  const style = useMemo<StyleProp<ViewStyle>>(
    () => [
      StyleSheet.absoluteFill,
      { justifyContent: 'flex-end' },
      insets,
      { backgroundColor: colorize ? randomHexColorAlpha() : undefined },
    ],
    [insets, colorize],
  )

  return (
    <Portal>
      <View pointerEvents={pointerEvents} style={style}>
        {children}
      </View>
    </Portal>
  )
}
export default NativePortal
