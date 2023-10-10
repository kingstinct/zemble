/* eslint-disable no-nested-ternary */
/* eslint-disable functional/immutable-data */

import { Controller } from 'react-hook-form'
import {
  TextInput,
} from 'react-native-paper'

import { styles } from '../style'

import type {
  Control, ControllerFieldState, ControllerRenderProps, FieldValues, Path, RegisterOptions, UseFormStateReturn,
} from 'react-hook-form'
import type { TextInputProps } from 'react-native-paper'
import { useCallback } from 'react'
import { useBottomSheetInternal } from '@gorhom/bottom-sheet'
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native'

type Props<T extends FieldValues> = { readonly control: Control<T>, readonly name: Path<T>, readonly rules?: RegisterOptions<T> } & TextInputProps

export function TextControl<T extends FieldValues>({
  control, name, rules, ...textInputProps
}: Props<T>) {
  const render = useCallback(
    ({ 
      field: { onChange, onBlur, value } 
    }: {
        field: ControllerRenderProps<T, typeof name>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<T>;
    }) => {
      const onBlurInternal = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        onBlur()
        textInputProps.onBlur?.(e)
      }
      return (
        <TextInput
          accessibilityHint={textInputProps.placeholder}
          accessibilityLabel={textInputProps.placeholder}
          onBlur={onBlurInternal}
          style={styles.textInputStyle}
          onChangeText={onChange}
          value={typeof value === 'string' ? value : ''}
          {...textInputProps}
        />
      )
    }, [textInputProps, name, control])
    
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={render}
    />
  )
}

export function TextControlInBottomSheet<T extends FieldValues>({ onFocus, onBlur, ...props}: Props<T>) {
  const {shouldHandleKeyboardEvents} = useBottomSheetInternal()

  const handleOnFocus = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true;
      onFocus?.(args);
    },
    [onFocus, shouldHandleKeyboardEvents]
  );
  const handleOnBlur = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false;
      onBlur?.(args);
    },
    [onBlur, shouldHandleKeyboardEvents]
  );

  return <TextControl {...props} onFocus={handleOnFocus} onBlur={handleOnBlur} />
}


export default TextControl
