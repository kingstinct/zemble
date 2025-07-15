import { Portal } from '@gorhom/portal'
import randomHexColorAlpha from '@zemble/utils/randomHexColor'
import React, { type PropsWithChildren, useMemo } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { StyleSheet, View } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'
import type { Props } from './NativePortal.types'

export const NativePortal: React.FC<PropsWithChildren<Props>> = ({
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
      <FullWindowOverlay>
        <View pointerEvents={pointerEvents} style={style}>
          {children}
        </View>
      </FullWindowOverlay>
    </Portal>
  )
}
export default NativePortal
