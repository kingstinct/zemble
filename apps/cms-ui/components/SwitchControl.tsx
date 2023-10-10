import { Controller } from 'react-hook-form'
import {
  Pressable,
} from 'react-native'
import {
  Switch,
  Text
} from 'react-native-paper'

import { styles } from '../style'

import type {
  Control, FieldValues, Path, RegisterOptions,
} from 'react-hook-form'

function SwitchControl<T extends FieldValues>({
  control, name, label, rules,
}: { readonly control: Control<T>, readonly name: Path<T>, readonly label: string, readonly rules?: RegisterOptions<T> }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Pressable
          accessibilityRole='button'
          onPress={() => onChange(!value)}
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
            onValueChange={onChange}
          />

        </Pressable>
      )}
    />
  )
}
export default SwitchControl
