import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text } from '@zemble/primitives'
import StringsContext from '@zemble/react/contexts/Strings'
import useEvent from '@zemble/react/hooks/useEvent'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native'
import { match } from 'ts-pattern'
import type { CombinedError } from 'urql'
import useIsOnline from '../hooks/useIsOnline'

const styles = StyleSheet.create({
  activityIndicator: { marginTop: 15 },
  container: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: { paddingBottom: 10, textAlign: 'center' },
  icon: { padding: 20 },
})

export type OnTryAgain<T = unknown> = () => Promise<T> | T
export type OnTryAgainWithNetworkStatus<T = unknown> = (
  wasNetworkRelated: boolean,
) => Promise<T> | void

export type GenericErrorProps = {
  readonly onTryAgain?: OnTryAgain
  readonly onTryAgainWithNetworkStatus?: OnTryAgainWithNetworkStatus
  readonly customMessage?: string
  readonly error: CombinedError | undefined
}

export const GenericError: React.FC<GenericErrorProps> = ({
  onTryAgain,
  onTryAgainWithNetworkStatus,
  customMessage,
  error,
}) => {
  const [loading, setLoading] = useState(false),
    isOnline = useIsOnline(),
    strings = useContext(StringsContext),
    [hasBeenOffline, setHasBeenOffline] = useState(false)

  useEffect(() => {
    if (!isOnline && isOnline !== null) {
      setHasBeenOffline(true)
    }
  }, [isOnline])

  const doTryAgain = useEvent(async () => {
    setLoading(true)
    try {
      await onTryAgain?.()
      await onTryAgainWithNetworkStatus?.(
        !hasBeenOffline && !error?.networkError,
      )
    } finally {
      setLoading(false)
    }
  })

  const message = useMemo(
    () =>
      customMessage ||
      match({ error, hasBeenOffline })
        .with({ hasBeenOffline: true }, () => strings['You are offline'])
        .when(
          ({ error }) => !!error?.networkError,
          () => strings['Network request failed'],
        )
        .otherwise(() => strings['Something went wrong, please try again']),
    [customMessage, error, hasBeenOffline, strings],
  )

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={!hasBeenOffline ? 'alert' : 'lightning-bolt-circle'}
        style={styles.icon}
      />
      <Text style={styles.text}>{message}</Text>
      {onTryAgain ? (
        <Button onPress={doTryAgain} title={strings['Try again']} />
      ) : null}
      {loading ? <ActivityIndicator style={styles.activityIndicator} /> : null}
    </View>
  )
}

export default GenericError
