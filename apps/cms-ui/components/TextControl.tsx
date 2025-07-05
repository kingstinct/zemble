import { useBottomSheetInternal } from '@gorhom/bottom-sheet'
import { useCallback } from 'react'
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormStateReturn,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native'
import type { TextInputProps } from 'react-native-paper'
import { TextInput } from 'react-native-paper'
import { styles } from '../style'

type Props<T extends FieldValues> = {
  readonly control: Control<T>
  readonly name: Path<T>
  readonly rules?: RegisterOptions<T>
} & TextInputProps

export function TextControl<T extends FieldValues>({
  control,
  name,
  rules,
  ...textInputProps
}: Props<T>) {
  const labelOrPlaceholder =
    (textInputProps.label
      ? textInputProps.label.toString()
      : textInputProps.placeholder) ?? ''
  const render = useCallback(
    ({
      field: { onChange, onBlur, value },
    }: {
      readonly field: ControllerRenderProps<T, typeof name>
      readonly fieldState: ControllerFieldState
      readonly formState: UseFormStateReturn<T>
    }) => {
      const onBlurInternal = (
        e: NativeSyntheticEvent<TextInputFocusEventData>,
      ) => {
        onBlur()
        textInputProps.onBlur?.(e)
      }
      return (
        <TextInput
          accessibilityHint={
            labelOrPlaceholder +
            (rules?.required ? ' - required' : ' - optional')
          }
          accessibilityLabel={
            labelOrPlaceholder +
            (rules?.required ? ' - required' : ' - optional')
          }
          onBlur={onBlurInternal}
          style={styles.textInputStyle}
          onChangeText={onChange}
          value={typeof value === 'string' ? value : ''}
          {...textInputProps}
          label={labelOrPlaceholder + (rules?.required ? ' *' : '')}
        />
      )
    },
    [labelOrPlaceholder, rules?.required, textInputProps],
  )

  return (
    <Controller control={control} name={name} rules={rules} render={render} />
  )
}

export function TextControlInBottomSheet<T extends FieldValues>({
  onFocus,
  onBlur,
  ...props
}: Props<T>) {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal()

  const handleOnFocus = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true
      onFocus?.(args)
    },
    [onFocus, shouldHandleKeyboardEvents],
  )
  const handleOnBlur = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false
      onBlur?.(args)
    },
    [onBlur, shouldHandleKeyboardEvents],
  )

  return (
    <TextControl {...props} onFocus={handleOnFocus} onBlur={handleOnBlur} />
  )
}

export default TextControl
