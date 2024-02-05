import { selectionAsync } from 'expo-haptics'
import { Platform } from 'react-native'

const doHaptics = async (enableHaptics?: boolean) => {
  if (enableHaptics === false) {
    return
  }

  if (enableHaptics === true || Platform.OS === 'ios') {
    await selectionAsync()
  }
}

export default doHaptics
