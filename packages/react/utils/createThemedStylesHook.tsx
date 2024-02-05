import React, { useMemo } from 'react'
import {
  Text as NativeText,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import useTheme from '../hooks/useTheme'

import type { PropsWithChildren } from 'react'
import type {
  ScaledSize,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native'
import type { EdgeInsets } from 'react-native-safe-area-context'

type FactoryCustomProps = Record<string, unknown> | undefined;

export type FactoryProps<TProps extends FactoryCustomProps> = TProps & {
  readonly theme: KingstinctTheme,
  readonly size: ScaledSize,
  readonly insets: EdgeInsets,
}

type Factory<TProps extends FactoryCustomProps, T extends StyleSheet.NamedStyles<T>> = (props: FactoryProps<TProps>) => StyleSheet.NamedStyles<T> | T

export function createThemedStylesHook<TProps extends FactoryCustomProps, TStyle extends StyleSheet.NamedStyles<TStyle>>(factory: Factory<TProps, TStyle>) {
  return (props?: TProps) => {
    const theme = useTheme(),
          size = useWindowDimensions(),
          insets = useSafeAreaInsets()

    return useMemo(() => StyleSheet.create(
      factory({
        insets, size, theme, ...props,
      } as FactoryProps<TProps>),
    ), [
      theme, size, insets, props,
    ])
  }
}

type ViewFactory<TProps extends FactoryCustomProps, T extends StyleProp<ViewStyle>> = (props: FactoryProps<TProps>) => T
export function createThemedView<TProps extends FactoryCustomProps, TStyle extends StyleProp<ViewStyle>>(factory: ViewFactory<TProps, TStyle>) {
  const ThemedComponent: React.FC<PropsWithChildren<TProps>> = ({ children, ...props }) => {
    const theme = useTheme(),
          size = useWindowDimensions(),
          insets = useSafeAreaInsets(),
          style = useMemo(
            () => factory({
              insets, size, theme, ...props,
            } as FactoryProps<TProps>),
            [
              theme, size, insets, props,
            ],
          )
    return <View {...props} style={style}>{children}</View>
  }

  return React.memo(ThemedComponent)
}

type TextFactory<TProps extends FactoryCustomProps, TStyle extends StyleProp<TextStyle>> = (props: FactoryProps<TProps>) => TStyle
export function createThemedText<TProps extends FactoryCustomProps, TStyle extends StyleProp<TextStyle>>(factory: TextFactory<TProps, TStyle>) {
  const ThemedComponent: React.FC<PropsWithChildren<TProps>> = ({ children, ...props }) => {
    const theme = useTheme(),
          size = useWindowDimensions(),
          insets = useSafeAreaInsets(),
          style = useMemo(
            () => factory({
              insets, size, theme, ...props,
            } as FactoryProps<TProps>),
            [
              theme, size, insets, props,
            ],
          )
    return <NativeText {...props} style={style}>{children}</NativeText>
  }

  return React.memo(ThemedComponent)
}

/*

type OptimizedFactoryProps = {
  readonly theme: Theme,
  readonly size: ScaledSize,
  readonly insets: EdgeInsets,
}
 * type OptimizedFactory<TProps extends FactoryCustomProps, TIncludedProps extends ReadonlyArray<keyof
 * OptimizedFactoryProps>, T extends StyleSheet.NamedStyles<T>> = (props: TProps & Pick<OptimizedFactoryProps,
 * TIncludedProps>) => T | StyleSheet.NamedStyles<T>

Maybe 1: would probably be good to shallow memoize custom props (so users don't need to worry about memoizing)
Maybe 2: specify requirements, something in the area of:
createStylesHook(({ theme, size, insets }) => {
...styles
}, ['theme', 'size', 'insets'])

 * export function createOptimizedThemedStylesHook<TProps extends FactoryCustomProps, TIncludedProps extends
 * ReadonlyArray<keyof OptimizedFactoryProps>, TStyle extends StyleSheet.NamedStyles<TStyle>>(factory:
 * OptimizedFactory<TProps, TIncludedProps, TStyle>, includedProps?: TIncludedProps) {
  return (props?: TProps) => {
    const theme = useTheme(),
          size = useWindowDimensions(),
          insets = useSafeAreaInsets()

    return useMemo(() => StyleSheet.create(factory({
      theme, size, insets, ...props,
    } as FactoryProps<TProps>)), [theme, size, insets, props])
  }
} */

export default createThemedStylesHook
