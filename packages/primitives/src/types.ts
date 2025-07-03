import type { PropsWithChildren } from 'react'
import type {
  StyleProp, TextStyle, ViewProps, ViewStyle, TextProps as NativeTextProps, DimensionValue,
} from 'react-native'

export type SharedProps = PropsWithChildren<{
  readonly center?: boolean,
  readonly centerX?: boolean,
  readonly centerY?: boolean,
  readonly colorize?: boolean,
  readonly colorizeBorder?: boolean,
  readonly fill?: boolean,
  readonly height?: DimensionValue,
  readonly margin?: DimensionValue,
  readonly marginBottom?: DimensionValue,
  readonly marginLeft?: DimensionValue,
  readonly marginRight?: DimensionValue,
  readonly marginTop?: DimensionValue,
  readonly marginX?: DimensionValue,
  readonly marginY?: DimensionValue,
  readonly padding?: DimensionValue,
  readonly paddingBottom?: DimensionValue,
  readonly paddingLeft?: DimensionValue,
  readonly paddingRight?: DimensionValue,
  readonly paddingTop?: DimensionValue,
  readonly paddingX?: DimensionValue,
  readonly paddingY?: DimensionValue,
  readonly width?: DimensionValue,
  readonly borderColor?: string,
  readonly borderWidth?: number,
}>

export type PrimitiveViewProps = Omit<ViewProps, 'style'> & SharedProps & {
  readonly spaceBetween?: boolean,
  readonly spaceAround?: boolean,
  readonly spaceEvenly?: boolean,
  readonly style?: StyleProp<ViewStyle>,
  readonly borderRadius?: number,
  readonly backgroundColor?: string,
}

export type TextProps = Omit<NativeTextProps, 'style'> & SharedProps & {
  readonly fontSize?: number,
  readonly fontWeight?: TextStyle['fontWeight'],
  readonly style?: StyleProp<TextStyle>,
}
