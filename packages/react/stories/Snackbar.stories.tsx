/* eslint-disable functional/immutable-data */

import type { Meta } from '@storybook/react'

import type { DefaultSnackbarComponentProps } from '../components/SnackbarComponent'
import DefaultSnackbarComponent from '../components/SnackbarComponent'

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

// eslint-disable-next-line functional/immutable-data
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

// eslint-disable-next-line functional/immutable-data
// @ts-expect-error fix later
Snickers.parameters = {
  controls: {
    exclude: ['index', 'id', 'doDismiss', 'entering', 'exiting', 'layout'],
  },
}
