/* eslint-disable functional/immutable-data */
import { Styles } from '@zemble/react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Avatar, Button, Card, Portal } from 'react-native-paper'
import type { EntityRelationField } from '../gql.generated/graphql'
import getDefaultValueFromEntityField from '../utils/getDefaultValueFromEntityField'
import SelectEntityRelation from './SelectEntityRelationControl'
import SwitchControl from './SwitchControl'
import TextControl from './TextControl'

type ArrayField = {
  readonly __typename: 'ArrayField'
  readonly name: string
  readonly isRequired: boolean
  readonly isRequiredInput: boolean
  readonly availableFields: ReadonlyArray<
    | { readonly __typename: 'ArrayField'; readonly name: string }
    | { readonly __typename: 'BooleanField'; readonly name: string }
    | { readonly __typename: 'EntityRelationField'; readonly name: string }
    | { readonly __typename: 'IDField'; readonly name: string }
    | { readonly __typename: 'NumberField'; readonly name: string }
    | { readonly __typename: 'StringField'; readonly name: string }
  >
}

type ArrayFieldComponentProps = {
  readonly field: ArrayField
  readonly items: readonly Record<string, unknown>[]
  readonly onChange: (items: readonly unknown[]) => void
}

const ArrayFieldComponent: React.FC<ArrayFieldComponentProps> = ({
  field,
  items,
  onChange,
}) => {
  const { control, handleSubmit, setValue, watch } = useForm({})

  useEffect(() => {
    items.forEach((item, index) => {
      const key = `${index}-${Object.keys(item)[0]!}`
      const value = Object.values(item)[0]
      setValue(key, value)
    })
  }, [field.name, items, setValue])

  const onSubmit = handleSubmit(
    useCallback(
      (vals) => {
        const keys = Object.keys(vals)
        const mappedValues = keys.map((key) => {
          const value = vals[key]
          // here we only care about the label, not the index in the key
          const [, label] = key.split('-')

          return { [label as string]: value }
        })

        onChange(mappedValues)
      },
      [onChange],
    ),
  )

  const [fieldForEntitySelection, setFieldForEntity] = useState<{
    readonly field: EntityRelationField
    readonly name: string
    readonly index: number
  } | null>(null)

  return (
    <Card key={field.name} style={Styles.margin8}>
      <Card.Title
        title={field.name + (field.isRequiredInput ? ' *' : '')}
        // subtitle={field.availableFields.map((a) => a.name).join(',')}
        left={(props) => <Avatar.Icon {...props} icon='format-list-group' />}
      />
      <Card.Content>
        {items.map((v, index) => {
          const label = Object.keys(v as object)[0] as string
          const subField = field.availableFields.find((f) => f.name === label)!
          const type = subField.__typename

          // prefix name with index to avoid collisions
          const name = `${index.toString()}-${label}`
          if (type === 'NumberField') {
            return (
              <TextControl
                control={control}
                name={name}
                label={label}
                keyboardType='numeric'
                onSubmitEditing={onSubmit}
                // todo [>1]: should probably introduce an id here
                // eslint-disable-next-line react/no-array-index-key
                key={name}
              />
            )
          }
          if (type === 'BooleanField') {
            return (
              <SwitchControl
                control={control}
                name={name}
                label={label}
                switchProps={{ onValueChange: async () => onSubmit() }}
                // todo [>1]: should probably introduce an id here
                // eslint-disable-next-line react/no-array-index-key
                key={name}
              />
            )
          }
          if (type === 'EntityRelationField') {
            const value = watch(name)

            return (
              <View key={name}>
                <Button
                  onPress={() => {
                    setFieldForEntity({
                      // @ts-expect-error fix later
                      field: subField,
                      name,
                      index,
                    })
                  }}
                  key={name}
                  icon='chevron-down'
                >
                  {value ?? `Select ${subField.name}`}
                </Button>
              </View>
            )
          }
          return (
            <TextControl
              control={control}
              name={name}
              label={label}
              onSubmitEditing={onSubmit}
              // todo [>1]: should probably introduce an id here
              // eslint-disable-next-line react/no-array-index-key
              key={name}
            />
          )
        })}
        {field.availableFields.map((f) => (
          <Button
            icon='plus'
            mode='outlined'
            key={f.name}
            style={Styles.margin8}
            onPress={() =>
              onChange([
                ...items,
                {
                  [f.name]:
                    'defaultValue' in f
                      ? f.defaultValue
                      : // @ts-expect-error fix later
                        getDefaultValueFromEntityField(f),
                },
              ])
            }
          >
            {`Add ${f.name}`}
          </Button>
        ))}
      </Card.Content>
      {fieldForEntitySelection ? (
        <Portal>
          <SelectEntityRelation
            control={control}
            fieldName={fieldForEntitySelection.name}
            label={`Select ${fieldForEntitySelection.field.name} (${fieldForEntitySelection.index})`}
            entityNamePlural={fieldForEntitySelection.field.entityNamePlural}
            onClose={() => {
              setFieldForEntity(null)
              void onSubmit()
            }}
            onChange={() => {
              setFieldForEntity(null)
              setTimeout(() => {
                void onSubmit()
              }, 100)
            }}
          />
        </Portal>
      ) : null}
    </Card>
  )
}

export default ArrayFieldComponent
