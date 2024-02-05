/*
Goals:
- simple and reasonaboutable layout
- easy to use - easier to read with main props lifted to prop level
- colorize is nice to quickly see what happens when developing

examples:

      <Grid colorize spaceEvenly>
        <Column colorize center width='50%' height={100}>
          <Text colorize>hello</Text>
        </Column>
        <Column colorize center width='50%' height={100}>
          <Text colorize>hello</Text>
        </Column>
        <Column colorize width='50%' height={100} center>
          <Text colorize center>hello</Text>
        </Column>
      </Grid>
      <Row colorize margin={10}>
        <Column fill colorize center padding={20}><Text>dfg</Text></Column>
      </Row>
*/

import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { match } from 'ts-pattern'

import randomHexColor from '../utils/randomHexColor'

import type { PrimitiveViewProps } from './types'
import type { StyleProp, ViewStyle } from 'react-native'

type OverlayProps = Omit<PrimitiveViewProps, 'backgroundColor'>

export const Overlay: React.FC<OverlayProps> = ({
  center, spaceBetween, spaceAround, spaceEvenly, centerY, centerX, fill, colorize, marginX, marginY, paddingY, paddingX, style, children, colorizeBorder, ...props
}) => {
  const internalStyle = useMemo<StyleProp<ViewStyle>>(() => ({
    alignItems: center || centerX ? 'center' : undefined,
    backgroundColor: colorize ? randomHexColor() : undefined,
    borderColor: colorizeBorder ? randomHexColor() : props.borderColor,
    borderWidth: colorizeBorder ? StyleSheet.hairlineWidth : props.borderWidth,
    flex: fill ? 1 : undefined,
    justifyContent: match({
      spaceBetween, spaceAround, spaceEvenly, center, centerY,
    })
      .with({ spaceBetween: true }, () => 'space-between' as const)
      .with({ spaceAround: true }, () => 'space-around' as const)
      .with({ spaceEvenly: true }, () => 'space-evenly' as const)
      .with({ center: true }, () => 'center' as const)
      .with({ centerY: true }, () => 'center' as const)
      .otherwise(() => undefined),
    marginHorizontal: marginX,
    marginVertical: marginY,
    paddingHorizontal: paddingX,
    paddingVertical: paddingY,
    ...StyleSheet.absoluteFillObject,
    ...props,
  }), [
    center, centerX, centerY, colorize, colorizeBorder, fill, marginX, marginY, paddingX, paddingY, props, spaceAround, spaceBetween, spaceEvenly,
  ])

  return <View pointerEvents='box-none' style={[internalStyle, style]}>{children}</View>
}

export default Overlay
