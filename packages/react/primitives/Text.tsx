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

import { createThemedText } from '../utils/createThemedStylesHook'
import randomHexColor from '../utils/randomHexColor'

import type { TextProps } from './types'
import type { FactoryProps } from '../utils/createThemedStylesHook'

export const Text = createThemedText(({
  center,
  centerY,
  centerX,
  fill,
  colorize,
  marginX,
  marginY,
  paddingY,
  paddingX,
  theme,
  fontWeight,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  insets,
  style,
  ...props
}: FactoryProps<TextProps>) => ([
  {
    backgroundColor: colorize ? randomHexColor() : undefined,
    color: theme.colors.text,
    flex: fill ? 1 : undefined,
    fontWeight,
    marginHorizontal: marginX,
    marginVertical: marginY,
    paddingHorizontal: paddingX,
    paddingVertical: paddingY,
    textAlign: center || centerX ? 'center' : undefined,
    textAlignVertical: centerY || center ? 'center' : undefined,
    ...props,
  }, style,
]))

export default Text
