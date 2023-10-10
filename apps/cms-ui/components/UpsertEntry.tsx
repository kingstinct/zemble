/* eslint-disable functional/immutable-data */
import { Styles } from '@kingstinct/react'
import {
  useCallback, useEffect, useMemo,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  View, ScrollView,
} from 'react-native'
import {
  ActivityIndicator, Avatar, Button, Card, Text,
} from 'react-native-paper'
import { useMutation, useQuery } from 'urql'

import SwitchControl from './SwitchControl'
import TextControl from './TextControl'
import getSelectionSet from '../utils/getSelectionSet'
import { capitalize } from '../utils/text'

import type {
  ArrayField, GetEntityByPluralizedNameQuery,
} from '../gql/graphql'
import type { UseFormProps } from 'react-hook-form'

const fieldToTypeMap: Record<string, string | ((entityName: string, fieldName: string) => string)> = {
  StringField: 'String',
  NumberField: 'Float',
  BooleanField: 'Boolean',
  IDField: 'ID',
  ArrayField: (entityName: string, fieldName: string) => `[${capitalize(entityName)}${capitalize(fieldName)}Input!]`,
  // ObjectRelationField: 'Object',
}

export type Entity = NonNullable<GetEntityByPluralizedNameQuery['getEntityByPluralizedName']>

const buildUpsertEntryMutation = (entity: Entity) => {
  const { fields } = entity

  const mutationName = `create${capitalize(entity.name)}`

  const mutationInputVariables = fields.map((f) => {
    const typeMap = fieldToTypeMap[f.__typename]!
    const mappedType = typeof typeMap === 'string' ? typeMap : typeMap(entity.name, f.name)
    const strParts = `$${f.name}: ${mappedType}${f.isRequired && f.name !== 'id' ? '!' : ''}`
    return strParts
  }).join(', ')

  const mutationVariables = fields.map((f) => `${f.name}: $${f.name}`).join(', ')

  const upsertEntryStr = `mutation UpsertEntry(${mutationInputVariables}) 
  { ${mutationName}(${mutationVariables})
    { 
      __typename
      id 
    } 
  }`

  console.log('upsertEntryStr', upsertEntryStr)

  return upsertEntryStr
}

export const getDefaultValueFromEntityField = (field: Entity['fields'][number]) => {
  if (field.__typename === 'ArrayField') {
    return []
  }
  if (field.__typename === 'StringField') {
    return field.defaultValueString ?? ''
  }
  if (field.__typename === 'NumberField') {
    return field.defaultValueNumber ?? 0
  }
  if (field.__typename === 'BooleanField') {
    return field.defaultValueBoolean ?? false
  }
  return null
}

type ArrayFieldComponentProps = {
  readonly field: ArrayField,
  readonly items: readonly Record<string, unknown>[],
  readonly onChange: (items: readonly unknown[]) => void
}

const ArrayFieldComponent: React.FC<ArrayFieldComponentProps> = ({ field, items, onChange }) => {
  const { control, handleSubmit, setValue } = useForm({

  })

  useEffect(() => {
    items.forEach((item, index) => {
      const key = `${index}-${Object.keys(item)[0]!}`
      const value = Object.values(item)[0]
      setValue(key, value)
    })
  }, [field.name, items, setValue])

  const onSubmit = handleSubmit(useCallback((vals) => {
    const keys = Object.keys(vals)
    const mappedValues = keys.map((key) => {
      const value = vals[key]
      const [index, label] = key.split('-')

      return { [label as string]: value }
    })
    onChange(mappedValues)
  }, [onChange]))

  return (
    <Card key={field.name} style={Styles.margin8}>
      <Card.Title
        title={field.name + (field.isRequiredInput ? ' *' : '')}
        // subtitle={field.availableFields.map((a) => a.name).join(',')}
        left={(props) => <Avatar.Icon {...props} icon='format-list-group' />}
      />
      <Card.Content>
        {
          items.map((v, index) => {
            console.log(v)
            const label = Object.keys(v as object)[0] as string
            return (
              <TextControl
                control={control}
                name={`${index.toString()}-${label}`}
                label={label}
                onSubmitEditing={onSubmit}
                // onChange={async () => onSubmit()}
                // todo [>=1]: should probably introduce an id here
                // eslint-disable-next-line react/no-array-index-key
                key={`${label}${index}`}
              />
            )
          })
        }
        { field.availableFields.map((f) => (
          <Button
            icon='plus'
            mode='outlined'
            key={f.name}
            style={Styles.margin8}
            // @ts-expect-error fix later
            onPress={() => onChange([...items, { [f.name]: 'defaultValue' in f ? f.defaultValue : getDefaultValueFromEntityField(f) }])}
          >
            {`Add ${f.name}`}
          </Button>
        )) }

      </Card.Content>
    </Card>
  )
}

const UpsertEntry: React.FC<{
  readonly entity: Entity,
  readonly previousEntryId?: string,
  readonly onUpdated?: () => void,
}> = ({
  entity,
  previousEntryId,
  onUpdated,
}) => {
  const { fields } = entity

  const selectionSet = useMemo(() => getSelectionSet(entity.name, fields), [entity.name, fields])

  const queryName = `get${capitalize(entity.name)}ById`

  const [{ data, fetching }] = useQuery({
    query: `query GetEntity { ${queryName}(id: "${previousEntryId}") { ${selectionSet.join(' ')} } }`,
    variables: {},
    pause: !previousEntryId,
    requestPolicy: 'cache-first',
  })

  const previousEntry = previousEntryId ? (data?.[queryName]as Record<string, unknown> | undefined) : undefined

  const [, createEntry] = useMutation(useMemo(() => buildUpsertEntryMutation(entity), [entity]))

  const defaults = useMemo(() => previousEntry ?? fields.reduce((acc, field) => {
    // eslint-disable-next-line no-nested-ternary, functional/immutable-data, unicorn/no-nested-ternary
    // @ts-expect-error fix later
    acc[field.name as unknown as string] = previousEntry ?? getDefaultValueFromEntityField(field)
    return acc
  }, {} as UseFormProps['defaultValues']), [fields, previousEntry])

  const {
    control, handleSubmit, setValue, formState: { errors }, watch,
  } = useForm({ defaultValues: defaults })

  useEffect(() => {
    if (data && data[queryName] && data[queryName]) {
      fields.forEach((field) => {
        const value = data[queryName][field.name]
        setValue(field.name, value)
      })
    }
  }, [
    data, queryName, fields, setValue,
  ])

  const onSubmit = handleSubmit(useCallback(async (values) => {
    const mappedValues = fields.reduce((acc, field) => {
      if (field.__typename === 'BooleanField' && values[field.name] !== undefined && values[field.name] !== '') {
        acc[field.name] = JSON.parse(values[field.name])
      }
      return acc
    }, values)

    console.log('mappedValues', mappedValues)

    const res = await createEntry(mappedValues)

    console.log('res', res)

    onUpdated?.()
  }, [createEntry, fields, onUpdated]))

  return fetching && previousEntryId ? <ActivityIndicator style={Styles.margin16} /> : (
    <View>
      <ScrollView>
        {
          entity.fields.map((field) => {
            const autoFocus = false/// index < 2
            if (field.__typename === 'IDField' && watch(field.name)) {
              return (
                <Text
                  key={field.name}
                  accessibilityHint={field.name}
                  style={{ padding: 8, margin: 8 }}
                  accessibilityLabel={field.name}
                >
                  {`ID: ${watch(field.name)}` as string}
                </Text>
              )
            }
            if (field.__typename === 'StringField') {
              return (
                <TextControl
                  key={field.name}
                  control={control}
                  autoFocus={autoFocus}
                  name={field.name}
                  label={field.name}
                  rules={{ required: field.isRequired }}
                />
              )
            }
            if (field.__typename === 'ArrayField') {
              return (
                <Controller
                  control={control}
                  name={field.name}
                  key={field.name}
                  render={({ field: { onChange, value } }) => (
                    <ArrayFieldComponent
                      field={field}
                      items={value}
                      onChange={onChange}
                    />
                  )}
                />
              )
            }
            if (field.__typename === 'EntityRelationField') {
              return <Text key={field.name}>Relation input here</Text>
            }
            if (field.__typename === 'NumberField') {
              return (
                <TextControl
                  autoFocus={autoFocus}
                  key={field.name}
                  control={control}
                  name={field.name}
                  keyboardType='numeric'
                  label={field.name}
                  rules={{ required: field.isRequired }}
                />
              )
            }
            if (field.__typename === 'BooleanField') {
              return (
                <SwitchControl
                  key={field.name}
                  control={control}
                  name={field.name}
                  label={field.name}
                  rules={{ required: field.isRequired }}
                />
              )
            }

            return null
          })
        }
        <View style={{ margin: 8 }}>
          <Text>
            {
              Object.keys(errors).map((key) => <Text key={key} style={{ color: 'red' }}>{JSON.stringify(errors[key])}</Text>)
            }
          </Text>
          <Button
            onPress={onSubmit}
            mode='contained'
          >
            Save
          </Button>
        </View>
        <View style={{ height: 400 }} />
      </ScrollView>

    </View>
  )
}

export default UpsertEntry
