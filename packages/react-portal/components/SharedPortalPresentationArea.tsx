import type { PropsWithChildren } from 'react'
import React, { useCallback } from 'react'
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import Animated, { CurvedTransition } from 'react-native-reanimated'
import useSharedPortalAreaStore from '../hooks/useSharedPortalAreaStore'
import NativePortal from './NativePortal'

export type SharedPortalPresentationAreaProps = PropsWithChildren<{
  readonly style?: StyleProp<ViewStyle>
  readonly colorize?: boolean
}>

export const SharedPortalPresentationArea: React.FC<
  SharedPortalPresentationAreaProps
> = ({ children, style, colorize }) => {
  const insets = useSharedPortalAreaStore((state) => state.insets)
  const setSize = useSharedPortalAreaStore((state) => state.setSize)

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setSize(event.nativeEvent.layout)
    },
    [setSize],
  )

  return (
    <NativePortal insets={insets} colorize={colorize}>
      <Animated.View
        layout={CurvedTransition.duration(500)}
        onLayout={onLayout}
        style={style}
        pointerEvents='box-none'
      >
        {children}
      </Animated.View>
    </NativePortal>
  )
}

export default SharedPortalPresentationArea
