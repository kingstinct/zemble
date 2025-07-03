/* eslint-disable import/no-unresolved */

import React, {
  useEffect, useRef,
} from 'react'
import {
  View,
} from 'react-native'

import { SnackbarPresentationView } from '../components'
import { DefaultSnackbarComponent } from '../components/SnackbarComponent'
import { useAddSnackbar } from '../hooks'

import type { SnackbarComponentProps } from '../components/SnackbarComponent'
import type { StoryFn, Meta } from '@storybook/react'

type MyData = {
  readonly 'yo': string
  readonly 'yo2': number
}

const Inner = () => {
  const addSnackbar = useAddSnackbar<MyData>()
  const counter = useRef(0)

  useEffect(() => {
    const ref = setInterval(() => {
      counter.current += 1
      addSnackbar(counter.current % 2 === 0 ? `${counter.current} shortie` : `${counter.current} yo a very long sdfgsdfg lhsdf.gl nsd  flghjdslfgjh sdlfgh jsdlkfhjg lsdfjhg lsdjfhg sldfhjg sdlfhgj sdlfjgh sdlfgh`, {
        type: 'yo2',
        data: 1,
        actions: [
          {
            label: 'ok',
            onPress: () => {

            },
          },
          {
            label: 'cancel',
            onPress: () => {

            },
          },
        ],
      })
    }, 2000)
    return () => clearInterval(ref)
  }, [addSnackbar])

  return (
    <View />
  )
}

const CustomSnackbar: React.FC<SnackbarComponentProps<MyData> & {readonly backgroundColor: string}> = ({ backgroundColor, ...props }) => (
  <DefaultSnackbarComponent
    {...props}
    style={{ backgroundColor: backgroundColor ?? 'red' }}
    textStyle={{ color: 'white' }}
    buttonColor='pink'
  />
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SnackbarsStory(props: any) {
  return (
    <View>
      <Inner />

      <SnackbarPresentationView
        Component={(innerProps) => (
          <CustomSnackbar
            {...innerProps}
            {...props}
          />
        )}
        style={{ paddingBottom: 200 }}
      />
    </View>
  )
}

export default {
  title: 'Example/Snackbars',
  component: SnackbarsStory,
  argTypes: {
    backgroundColor: {
      control: {
        type: 'color',
        presetColors: ['#ff0000', '#00ff00', '#0000ff'],
      },
    },
  },
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof SnackbarsStory>

const Template: StoryFn<typeof SnackbarsStory> = (props) => <SnackbarsStory {...props} />

export const Snackbars = Template.bind({})
// eslint-disable-next-line functional/immutable-data
Snackbars.args = {}
