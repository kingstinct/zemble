/* eslint-disable functional/immutable-data */
import { Styles } from '@zemble/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { UseFormProps } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'
import { ActivityIndicator, Button, Text } from 'react-native-paper'
import { useMutation, useQuery } from 'urql'
import type { EntityRelationField } from '../gql.generated/graphql'
import buildUpsertEntryMutation from '../graphql/buildUpsertEntryMutation'
import getDefaultValueFromEntityField from '../utils/getDefaultValueFromEntityField'
import type { Entity } from '../utils/getSelectionSet'
import getSelectionSet from '../utils/getSelectionSet'
import { capitalize } from '../utils/text'
import SelectEntityRelation from './SelectEntityRelationControl'
import SwitchControl from './SwitchControl'
import TextControl from './TextControl'
import ArrayFieldComponent from './UpsertEntryArray'

const UpsertEntry: React.FC<{
  readonly entity: Entity
  readonly previousEntryId?: string
  readonly onUpdated?: () => void
}> = ({ entity, previousEntryId, onUpdated }) => {
  const { fields } = entity

  const selectionSet = useMemo(() => getSelectionSet(entity), [entity])

  const queryName = `get${capitalize(entity.nameSingular)}ById`

  const [{ data, fetching }] = useQuery({
    query: `query GetEntity { ${queryName}(id: "${previousEntryId}") { ${selectionSet.join(' ')} } }`,
    variables: {},
    pause: !previousEntryId,
    requestPolicy: 'cache-first',
  })

  // const previousEntry = previousEntryId ? (data?.[queryName]as Record<string, unknown> | undefined) : undefined

  const [, createEntry] = useMutation(useMemo(() => buildUpsertEntryMutation(entity), [entity]))

  const defaults = useMemo(
    () =>
      fields.reduce(
        (acc, field) => {
          // eslint-disable-next-line no-nested-ternary, functional/immutable-data, unicorn/no-nested-ternary
          // @ts-expect-error fix later
          acc[field.name as unknown as string] = getDefaultValueFromEntityField(field)
          return acc
        },
        {} as UseFormProps['defaultValues'],
      ),
    [fields],
  )

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: defaults })

  useEffect(() => {
    if (data && data[queryName] && data[queryName]) {
      fields.forEach((field) => {
        const value = data[queryName][field.name]

        if (value && field.__typename === 'EntityRelationField') {
          setValue(field.name, value.id)
        } else if (value && field.__typename === 'ArrayField' && Array.isArray(value)) {
          setValue(
            field.name,
            value.map((v) => {
              const key = `${Object.keys(v)[0]}`
              const value = v[key]

              // todo [>1]: should probably check this in a better way
              if ('id' in value) {
                return { [key]: value.id }
              }
              return { [key]: value }
            }),
          )
        } else if (value) {
          setValue(field.name, value)
        }
      })
    }
  }, [data, queryName, fields, setValue])

  const onSubmit = handleSubmit(
    useCallback(
      async (values) => {
        const mappedValues = fields.reduce((acc, field) => {
          if (field.__typename === 'BooleanField' && values[field.name] !== undefined && values[field.name] !== '') {
            acc[field.name] = JSON.parse(values[field.name])
          }
          return acc
        }, values)

        await createEntry(mappedValues)

        onUpdated?.()
      },
      [createEntry, fields, onUpdated],
    ),
  )

  const [fieldForEntitySelection, setFieldForEntity] = useState<EntityRelationField | null>(null)

  return fetching && previousEntryId ? (
    <ActivityIndicator style={Styles.margin16} />
  ) : (
    <View>
      <ScrollView>
        {entity.fields.map((field) => {
          const autoFocus = false /// index < 2
          if (field.__typename === 'IDField' && watch(field.name)) {
            return (
              <Text key={field.name} accessibilityHint={field.name} style={{ padding: 8, margin: 8 }} accessibilityLabel={field.name}>
                {`ID: ${watch(field.name)}` as string}
              </Text>
            )
          }
          if (field.__typename === 'StringField') {
            return <TextControl key={field.name} control={control} autoFocus={autoFocus} name={field.name} label={field.name} rules={{ required: field.isRequired }} />
          }
          if (field.__typename === 'ArrayField') {
            return (
              <Controller control={control} name={field.name} key={field.name} render={({ field: { onChange, value } }) => <ArrayFieldComponent field={field} items={value} onChange={onChange} />} />
            )
          }
          if (field.__typename === 'EntityRelationField') {
            return (
              <Button
                onPress={() => {
                  // @ts-expect-error fix later
                  setFieldForEntity(field)
                }}
                key={field.name}
                icon='chevron-down'
              >
                {data[queryName][field.name] ? data[queryName][field.name].displayName : `Select ${field.name}`}
              </Button>
            )
          }
          if (field.__typename === 'NumberField') {
            return <TextControl autoFocus={autoFocus} key={field.name} control={control} name={field.name} keyboardType='numeric' label={field.name} rules={{ required: field.isRequired }} />
          }
          if (field.__typename === 'BooleanField') {
            return <SwitchControl key={field.name} control={control} name={field.name} label={field.name} rules={{ required: field.isRequired }} />
          }

          return null
        })}
        <View style={{ margin: 8 }}>
          <Text>
            {Object.keys(errors).map((key) => (
              <Text key={key} style={{ color: 'red' }}>
                {JSON.stringify(errors[key])}
              </Text>
            ))}
          </Text>
          <Button onPress={onSubmit} mode='contained'>
            Save
          </Button>
        </View>
        <View style={{ height: 400 }} />
      </ScrollView>
      {fieldForEntitySelection ? <SelectEntityRelation control={control} fieldName={fieldForEntitySelection.name} entityNamePlural={fieldForEntitySelection.entityNamePlural} /> : null}
    </View>
  )
}

export default UpsertEntry
