import { Portal } from '@gorhom/portal'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'

import randomHexColorAlpha from '@zemble/react/utils/randomHexColor'

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
      <FullWindowOverlay>
        <View
          pointerEvents={pointerEvents}
          style={style}
        >
          { children }
        </View>
      </FullWindowOverlay>
    </Portal>
  )
}
export default NativePortal
