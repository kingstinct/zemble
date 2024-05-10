import { useState } from 'react'
import { Button, Text, View } from 'react-native'

import { useAlert, useConfirm } from '../hooks'

import type { StoryFn, Meta } from '@storybook/react'

function SnackbarsStory() {
  const alert = useAlert()
  const confirm = useConfirm()
  const [confirmResponse, setConfirmResponse] = useState<boolean>()

  return (
    <View>
      <Button title='Open an alert' onPress={async () => alert('This is an alert', 'This is the message')} />

      <View style={{ height: 16 }} />

      <Button title='Open a confirmation dialog' onPress={async () => setConfirmResponse(await confirm('This is a confirmation dialog', 'This is the message'))} />
      <Text>
        Response from confirmation dialog:
        {JSON.stringify(confirmResponse)}
      </Text>
    </View>
  )
}

export default {
  title: 'Example/Alerts',
  component: SnackbarsStory,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof SnackbarsStory>

const Template: StoryFn<typeof SnackbarsStory> = () => <SnackbarsStory />

export const Alerts = Template.bind({})
// eslint-disable-next-line functional/immutable-data
Alerts.args = {}
