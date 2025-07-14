/** biome-ignore-all lint/correctness/noUndeclaredDependencies: intended */
import type { Meta } from '@storybook/react'

import type { DefaultSnackbarComponentProps } from '@zemble/react-snackbar/components/SnackbarComponent'
import DefaultSnackbarComponent from '@zemble/react-snackbar/components/SnackbarComponent'

export default {
  title: 'Example/Snackbar',
  component: DefaultSnackbarComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
    buttonColor: { control: 'color' },
    textColor: { control: 'color', description: '`ColorValue`' },
    doDismiss: { action: 'doDismiss' },
  },
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof DefaultSnackbarComponent>

const Template = DefaultSnackbarComponent

export const Snickers = Template.bind({})

// @ts-expect-error fix later
Snickers.args = {
  backgroundColor: '#eee',
  textColor: 'purple',
  textStyle: {},
  style: {},
  buttonColor: 'red',
  buttonTextStyle: {},
  snackbarConfig: { title: 'hello', actions: [{ label: 'ok' }] },
} as Partial<DefaultSnackbarComponentProps>

// @ts-ignore
Snickers.parameters = {
  controls: {
    exclude: ['index', 'id', 'doDismiss', 'entering', 'exiting', 'layout'],
  },
}
