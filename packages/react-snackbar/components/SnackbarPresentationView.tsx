import React, { useEffect } from 'react'
import { View } from 'react-native'

import DefaultSnackbarComponent from './SnackbarComponent'
import useRemoveSnackbar from '../hooks/useRemoveSnackbar'
import useSnackbarsToShow from '../hooks/useSnackbarsToShow'
import useSnackbarWasPresented from '../hooks/useSnackbarWasPresented'
import randomHexColorAlpha from '../utils/randomHexColor'

import type { SnackbarComponentProps } from './SnackbarComponent'
import type { StyleProp, ViewStyle } from 'react-native'

export type SnackbarPresentationViewProps = {
  readonly Component?: React.FC<SnackbarComponentProps>,
  readonly style?: StyleProp<ViewStyle>
  readonly isVisibleToUser?: boolean,
  readonly colorize?: boolean
}

/**
 * This component should be placed where you want the snackbars to be shown.
 */
export const SnackbarPresentationView: React.FC<SnackbarPresentationViewProps> = ({
  Component = DefaultSnackbarComponent,
  isVisibleToUser = true,
  style,
  colorize,
}) => {
  const snackbarWasPresented = useSnackbarWasPresented()
  const snackbarsToShow = useSnackbarsToShow()
  const removeSnackbar = useRemoveSnackbar()

  useEffect(() => {
    if (isVisibleToUser) {
      snackbarsToShow.forEach((snackbar) => snackbarWasPresented(snackbar.id))
    }
  }, [snackbarsToShow, snackbarWasPresented, isVisibleToUser])

  return (
    <View
      pointerEvents='box-none'
      style={[style, { backgroundColor: colorize ? randomHexColorAlpha() : undefined }]}
    >
      { snackbarsToShow.map((i, index) => (
        <Component
          doDismiss={removeSnackbar}
          key={i.id}
          id={i.id}
          snackbarConfig={i.snackbarConfig}
          index={index}
        />
      )) }
    </View>
  )
}

export default SnackbarPresentationView
