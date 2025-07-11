/** biome-ignore-all lint/correctness/noUndeclaredDependencies: intended */
import { NavigationContainer } from '@react-navigation/native'
import { Column, Row } from '@zemble/primitives'
import {
  useIsKeyboardShown,
  useKeyboardHeight,
  useWillKeyboardBeShown,
} from '@zemble/react-keyboard'
import { StringsProvider } from '@zemble/react-network'
import {
  NativePortal,
  SharedPortalAreaProvider,
  SharedPortalPresentationArea,
  useSharedPortalAreaInsets,
  useSharedPortalAreaSize,
} from '@zemble/react-portal'
import type { SnackbarComponentProps } from '@zemble/react-snackbar'
import {
  DefaultSnackbarComponent,
  SnackbarPresentationView,
  useAddSnackbar,
  useSnackbarSettings,
} from '@zemble/react-snackbar'
import { StatusBar } from 'expo-status-bar'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Button,
  Switch,
  Text,
  TextInput,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { CurvedTransition } from 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useAlert from '../hooks/useAlert'
import useConfirm from '../hooks/useConfirm'

const CustomSnackbarComponent: React.FC<SnackbarComponentProps> = (props) => (
  <DefaultSnackbarComponent
    {...props}
    backgroundColor='#333'
    textStyle={{ color: 'white' }}
    buttonColor='pink'
  />
)

const Body: React.FC = () => {
  const insets = useSharedPortalAreaInsets()
  const size = useSharedPortalAreaSize()
  const [hasCustomSnackbar, setHasCustomSnackbar] = useState(false)
  const [confirmationDialogResponse, setConfirmationDialogResponse] =
    useState<boolean>()
  const addSnackbar = useAddSnackbar()
  const alert = useAlert()
  const confirm = useConfirm()

  const isKeyboardShown = useIsKeyboardShown()
  const keyboardHeight = useKeyboardHeight()
  const willKeyboardBeShown = useWillKeyboardBeShown()

  const addShortSnackbar = useCallback(() => {
    addSnackbar('This is a short snackbar title', {
      actions: [{ label: 'ok' }, { label: 'cancel' }],
    })
  }, [addSnackbar])

  const addVerboseSnackbar = useCallback(() => {
    addSnackbar(
      'This is a very long snackbar title. Ipsum something and other stuff in a long meaningless sentence! asdf asdf asdf asd fasdf asdf asdfa sdfas dfa sdfas fas dfas dfsadfasfd',
      { actions: [{ label: 'ok' }, { label: 'cancel' }] },
    )
  }, [addSnackbar])

  const SnackbarComponent = useMemo(
    () =>
      hasCustomSnackbar ? CustomSnackbarComponent : DefaultSnackbarComponent,
    [hasCustomSnackbar],
  )

  return (
    <SafeAreaProvider>
      <Column fill padding={16} spaceAround>
        <Text>{`isKeyboardShown: ${isKeyboardShown.toString()}`}</Text>
        <Text>{`keyboardHeight: ${keyboardHeight}`}</Text>
        <Text>{`willKeyboardBeShown: ${willKeyboardBeShown}`}</Text>

        <TextInput
          accessibilityHint='Text input field'
          accessibilityLabel='Text input field'
          placeholder='This is a text input'
        />

        <Row
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text>Use custom snackbar</Text>
          <Switch
            onChange={() => setHasCustomSnackbar((v) => !v)}
            value={hasCustomSnackbar}
          />
        </Row>

        <Button
          title='Add snackbar'
          onPress={() => {
            addSnackbar('Click to add another snackbar that is different', {
              actions: [
                { label: 'Short', onPress: addShortSnackbar },
                { label: 'Verbose', onPress: addVerboseSnackbar },
              ],
            })
          }}
        />

        <Button
          title='Show alert dialog'
          onPress={() => {
            void alert('This is an alert dialog', 'This is the message')
          }}
        />

        <Button
          title='Show confirmation dialog'
          onPress={async () =>
            setConfirmationDialogResponse(
              await confirm(
                'This is a confirmation dialog',
                'This is the message',
              ),
            )
          }
        />

        <Text>
          Response from confirmation dialog:
          {confirmationDialogResponse?.toString()}
        </Text>
      </Column>
      <NativePortal
        pointerEvents='none'
        insets={{ bottom: insets.bottom + size.height, right: 10, left: 360 }}
      >
        <Animated.View layout={CurvedTransition} style={{}}>
          <ActivityIndicator />
        </Animated.View>
      </NativePortal>
      <SharedPortalPresentationArea style={{ marginBottom: 200 }}>
        <SnackbarPresentationView
          key='124233'
          Component={SnackbarComponent}
          colorize
        />
      </SharedPortalPresentationArea>
    </SafeAreaProvider>
  )
}

export default function App() {
  useSnackbarSettings({ snackbarsToShowAtSameTime: 3 })

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <SharedPortalAreaProvider>
            <StringsProvider strings={{ Cancel: 'Dismiss', OK: 'Sure' }}>
              <StatusBar />
              <Body />
            </StringsProvider>
          </SharedPortalAreaProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
