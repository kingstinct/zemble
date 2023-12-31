import { useCallback } from 'react'
import { Controller } from 'react-hook-form'
import {
  Pressable,
} from 'react-native'
import {
  Switch,
  Text,
} from 'react-native-paper'

import { styles } from '../style'

import type {
  Control, ControllerFieldState, ControllerRenderProps, FieldValues, Path, RegisterOptions, UseFormStateReturn,
} from 'react-hook-form'
import type { SwitchProps } from 'react-native-paper'

function SwitchControl<T extends FieldValues>({
  control, name, label, rules, switchProps,
}: { readonly control: Control<T>, readonly name: Path<T>, readonly label: string, readonly rules?: RegisterOptions<T>, readonly switchProps?: SwitchProps }) {
  const render = useCallback(({ field: { onChange: onChangeForm, value } }: {
    readonly field: ControllerRenderProps<T, typeof name>;
    readonly fieldState: ControllerFieldState;
    readonly formState: UseFormStateReturn<T>;
  }) => {
    const onChangeInternal = (value: boolean) => {
      onChangeForm(value)
      void switchProps?.onValueChange?.(value)
    }

    return (
      <Pressable
        accessibilityRole='button'
        onPress={() => onChangeInternal(!value)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 16,
        }}
      >
        <Text>
          {label}
        </Text>
        <Switch
          accessibilityHint={label}
          accessibilityLabel={label}
          value={value}
          style={styles.booleanFieldSwitch}
          onValueChange={onChangeInternal}
          {...switchProps}
        />

      </Pressable>
    )
  }, [label, switchProps])

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={render}
    />
  )
}
export default SwitchControl
