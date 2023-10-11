/* eslint-disable no-nested-ternary */
/* eslint-disable functional/immutable-data */

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import {
  Button, Menu,
} from 'react-native-paper'

import type {
  Control, FieldValues, Path, RegisterOptions,
} from 'react-hook-form'

const FieldTypeMenuItem = ({ onChange, fieldType, value }) => (
  <Menu.Item
    leadingIcon={({ color, size, allowFontScaling }) => (
      <MaterialCommunityIcons
        allowFontScaling={allowFontScaling}
        size={size}
        name='check'
        style={{ opacity: value === fieldType ? 1 : 0.3 }}
        color={color}
      />
    )}
    onPress={() => onChange(fieldType)}
    title={fieldType}
  />
)

type ButtonStyle = React.ComponentProps<typeof Button>['style']

function SelectOneController<T extends FieldValues>({
  control,
  name,
  rules,
  buttonStyle,
  options,
}: { readonly control: Control<T>, readonly name: Path<T>, readonly rules?: RegisterOptions<T>, readonly options: readonly string[], readonly buttonStyle?: ButtonStyle }) {
  const [visible, setVisible] = useState(false)
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => {
        const onChanged = (value: string) => {
          onChange(value)
          setVisible(false)
        }

        return (
          <Menu
            visible={visible}
            onDismiss={() => {
              setVisible(false)
              onBlur()
            }}
            anchor={(
              <Button style={buttonStyle} mode='outlined' onPress={() => setVisible(true)} icon='chevron-down'>
                { value }
              </Button>
            )}
          >
            { options.map((option) => <FieldTypeMenuItem key={option} onChange={onChanged} fieldType={option} value={value} />) }
          </Menu>
        )
      }}
    />
  )
}
export default SelectOneController
