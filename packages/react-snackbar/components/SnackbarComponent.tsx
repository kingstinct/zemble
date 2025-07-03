import React, { useCallback } from 'react'
import {
  Platform, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import type { Action, SnackbarConfig } from '../hooks/useSnackbarStore'
import type { PropsWithChildren } from 'react'
import type {
  StyleProp, ViewStyle, ColorValue, TextStyle,
} from 'react-native'

const DEFAULT_BACKGROUND_COLOR = '#323232',
      DEFAULT_BUTTON_TEXT_COLOR = '#B28FF0',
      DEFAULT_TEXT_COLOR = '#CDCDCD'

export const styles = StyleSheet.create({
  snackbarContent: {
    marginBottom: Platform.OS === 'web' ? 0 : 16,
  },
  buttonText: {
    color: DEFAULT_BUTTON_TEXT_COLOR,
    fontWeight: '500',
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  nonFirstButton: {
    marginLeft: 16,
  },
  snackbar: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    padding: 16,
    borderRadius: 5,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  snackbarText: {
    color: DEFAULT_TEXT_COLOR,
  },
  snackbarButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexGrow: 1,
    marginBottom: Platform.OS === 'web' ? 0 : 16,
    alignItems: 'center',
  },
})

export type SnackbarComponentProps<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap> = {
  readonly snackbarConfig: SnackbarConfig<TMap, T>,
  readonly index: number,
  readonly doDismiss: (snackbarId: string) => void,
  readonly id: string,
}

export type DefaultSnackbarWrapperProps = SnackbarComponentProps & {
  readonly backgroundColor?: ColorValue,
  readonly buttonColor?: ColorValue,
  readonly buttonTextStyle?: StyleProp<TextStyle>,
  readonly style?: StyleProp<ViewStyle>,
  readonly entering?: typeof FadeIn | null,
  readonly exiting?: typeof FadeOut | null,
  readonly contentStyle?: StyleProp<ViewStyle>,
}

export type DefaultSnackbarComponentProps = DefaultSnackbarWrapperProps & {
  readonly textColor?: ColorValue,
  readonly textStyle?: StyleProp<TextStyle>,
}

const DEFAULT_ANIMATION_DURATION = 500

export const DEFAULT_ENTERING = FadeIn.duration(DEFAULT_ANIMATION_DURATION)
export const DEFAULT_EXITING = FadeOut.duration(DEFAULT_ANIMATION_DURATION)

export const DefaultSnackbarComponent: React.FC<DefaultSnackbarComponentProps> = React.memo(({
  snackbarConfig,
  textColor,
  textStyle,
  ...wrapperProps
}) => (
  <DefaultSnackbarWrapper {...wrapperProps} snackbarConfig={snackbarConfig}>
    <Text style={[styles.snackbarText, textStyle, textColor ? { color: textColor } : null]}>{snackbarConfig.title}</Text>
  </DefaultSnackbarWrapper>
))

export const DefaultSnackbarWrapper: React.FC<PropsWithChildren<DefaultSnackbarWrapperProps>> = React.memo(({
  snackbarConfig,
  doDismiss, backgroundColor, buttonColor, buttonTextStyle, id, style, entering, exiting,
  children,
  contentStyle,
}) => {
  const renderButton = useCallback((a: Action, index: number) => (
    <TouchableOpacity
      accessibilityRole='button'
      key={a.key || a.label}
      onPress={() => {
        doDismiss(id)
        a.onPress?.(a)
      }}
    >
      <Text style={[
        styles.buttonText,
        buttonTextStyle,
        buttonColor ? { color: buttonColor } : null,
        index === 0 ? null : styles.nonFirstButton,
      ]}
      >
        {a.label}
      </Text>
    </TouchableOpacity>
  ), [
    buttonColor, buttonTextStyle, doDismiss, id,
  ])

  return (
    <Animated.View
      entering={entering ?? DEFAULT_ENTERING}
      // layout={layout ?? DEFAULT_LAYOUT} // 2x duration since it's is over a longer distance
      exiting={exiting ?? DEFAULT_EXITING}
    >

      <View style={[styles.snackbar, style, backgroundColor ? { backgroundColor } : null]}>
        <View style={[styles.snackbarContent, contentStyle]}>
          { children }
        </View>
        <View style={styles.snackbarButtonWrapper}>
          { snackbarConfig.actions?.map(renderButton) }
        </View>
      </View>
    </Animated.View>
  )
})

export default DefaultSnackbarComponent
