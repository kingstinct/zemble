import { AuthContext } from '@zemble/react'
import { useCallback, useContext, useRef, useState } from 'react'
import type { TextInput as TextInputNative } from 'react-native'
import { KeyboardAvoidingView, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, TextInput, Title } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMutation } from 'urql'
import { graphql } from '../../gql.generated'

type TextInputHandles = Pick<
  TextInputNative,
  'focus' | 'clear' | 'blur' | 'isFocused'
>

export const LoginConfirmMutation = graphql(`
  mutation LoginConfirm($email: String!, $code: String!) {
    loginConfirmWithEmail(email: $email, code: $code) {
      __typename
      ... on LoginConfirmSuccessfulResponse {
        bearerToken
      }
      ... on Error {
        message
      }
    }
  }
`)

export const LoginRequestMutation = graphql(`
  mutation LoginRequest($email: String!) {
    loginRequestWithEmail(email: $email) {
      __typename
      ... on Error {
        message
      }
    }
  }
`)

const Login = () => {
  const { setToken } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [{ data: requestData, fetching: fetchingRequest }, loginRequest] =
    useMutation(LoginRequestMutation)
  const [{ fetching: fetchingConfirm }, loginConfirm] =
    useMutation(LoginConfirmMutation)
  const doRequest = useCallback(async () => {
    await loginRequest({ email })
    txtPasswordRef.current?.focus()
  }, [email, loginRequest])
  const doConfirm = useCallback(async () => {
    const { data } = await loginConfirm({ email, code })

    if (
      data?.loginConfirmWithEmail.__typename ===
      'LoginConfirmSuccessfulResponse'
    ) {
      setToken(data.loginConfirmWithEmail.bearerToken)
    }
  }, [email, code, loginConfirm, setToken])

  const txtPasswordRef = useRef<TextInputHandles>(null)

  return (
    <SafeAreaView style={{ padding: 16, flex: 1 }}>
      <KeyboardAwareScrollView
        keyboardDismissMode='interactive'
        keyboardShouldPersistTaps='handled'
        style={{}}
        contentContainerStyle={{ flex: 1 }}
      >
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
          <Title>Login to CMS Admin</Title>
          <TextInput
            accessibilityLabel='Email input field'
            accessibilityHint='email'
            value={email}
            label='Email'
            placeholder='Email'
            onChangeText={setEmail}
            onSubmitEditing={doRequest}
            autoComplete='email'
            keyboardType='email-address'
            returnKeyType='next'
            autoFocus
          />
          {requestData ? (
            <TextInput
              // @ts-expect-error sadface
              ref={txtPasswordRef}
              accessibilityLabel='Text input field'
              value={code}
              accessibilityHint='code'
              onChangeText={setCode}
              maxLength={6}
              label='One Time Code'
              placeholder='One Time Code'
              keyboardType='number-pad'
              autoComplete='one-time-code'
              importantForAutofill='yes'
              onSubmitEditing={doConfirm}
              returnKeyType='send'
            />
          ) : null}
          <View style={{ flex: 1 }} />
          <Button
            onPress={doRequest}
            loading={fetchingRequest}
            disabled={fetchingConfirm || fetchingRequest}
            mode={requestData ? 'text' : 'contained'}
          >
            {requestData ? 'Request code again' : 'Continue'}
          </Button>
          {requestData ? (
            <Button
              onPress={doConfirm}
              loading={fetchingConfirm}
              disabled={fetchingConfirm || fetchingRequest}
              mode='contained'
            >
              Continue
            </Button>
          ) : null}
          <View style={{ height: 80 }} />
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default Login
