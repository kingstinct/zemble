/* eslint-disable functional/immutable-data */
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Styles } from '@kingstinct/react'
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  View, ScrollView,
} from 'react-native'
import {
  ActivityIndicator, Avatar, Button, Card, Searchbar, Text, useTheme,
} from 'react-native-paper'
import { useMutation, useQuery } from 'urql'

import { SearchEntries } from './ListOfEntries'
import SwitchControl from './SwitchControl'
import TextControl from './TextControl'
import { graphql } from '../gql'
import getSelectionSet from '../utils/getSelectionSet'
import { capitalize } from '../utils/text'

import type {
  Field, GetEntityByPluralizedNameQuery as GetEntityByPluralizedNameQueryType,
} from '../gql/graphql'
import type {
  Control, FieldValues, Path, UseFormProps,
} from 'react-hook-form'

const fieldToTypeMap: Record<string, string | ((entityName: string, fieldName: string) => string)> = {
  StringField: 'String',
  NumberField: 'Float',
  BooleanField: 'Boolean',
  IDField: 'ID',
  ArrayField: (entityName: string, fieldName: string) => `[${capitalize(entityName)}${capitalize(fieldName)}Input!]`,
  EntityRelationField: (entityName: string, fieldName: string) => `${capitalize(entityName)}${capitalize(fieldName)}Input`,
}

export type Entity = NonNullable<GetEntityByPluralizedNameQueryType['getEntityByPluralizedName']>

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

type ArrayField = {
  readonly __typename: 'ArrayField',
  readonly name: string,
  readonly isRequired: boolean,
  readonly isRequiredInput: boolean,
  readonly availableFields: ReadonlyArray<{ readonly __typename: 'ArrayField', readonly name: string } | { readonly __typename: 'BooleanField', readonly name: string } | { readonly __typename: 'EntityRelationField', readonly name: string } | { readonly __typename: 'IDField', readonly name: string } | { readonly __typename: 'NumberField', readonly name: string } | { readonly __typename: 'StringField', readonly name: string }>
}

type ArrayFieldComponentProps = {
  readonly field: ArrayField,
  readonly items: readonly Record<string, unknown>[],
  readonly onChange: (items: readonly unknown[]) => void
}

const ArrayFieldComponent: React.FC<ArrayFieldComponentProps> = ({ field, items, onChange }) => {
  const {
    control, handleSubmit, setValue,
  } = useForm({ })

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
      // here we only care about the label, not the index in the key
      const [, label] = key.split('-')

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
            const label = Object.keys(v as object)[0] as string
            const type = field.availableFields.find((f) => f.name === label)!.__typename
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
                  // todo [>=1]: should probably introduce an id here
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
                  // todo [>=1]: should probably introduce an id here
                  // eslint-disable-next-line react/no-array-index-key
                  key={name}
                />
              )
            }
            return (
              <TextControl
                control={control}
                name={name}
                label={label}
                onSubmitEditing={onSubmit}
                // todo [>=1]: should probably introduce an id here
                // eslint-disable-next-line react/no-array-index-key
                key={name}
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

export const GetEntityByNameQuery = graphql(`
  query GetEntityByName($name: String!) { getEntityByName(name: $name) { 
    name
    pluralizedName
    fields { 
      name
      __typename 
      isRequired
      isRequiredInput

      ... on EntityRelationField {
        entityName
      }

      ... on StringField {
        defaultValueString: defaultValue
        isSearchable
      }
      
      ... on NumberField {
        defaultValueNumber: defaultValue
      }
      
      ... on  BooleanField{
        defaultValueBoolean: defaultValue
      }
      ... on ArrayField {
        availableFields {
          name
          __typename
        }
      }
   } } }
`)

function SelectEntityRelation<T extends FieldValues>({ control, fieldName, entityName }: { readonly control: Control<T>, readonly fieldName: Path<T>, readonly entityName: string }) {
  const bottomSheet = useRef<BottomSheet>(null)
  const theme = useTheme()

  const [{ data }] = useQuery({
    query: GetEntityByNameQuery,
    variables: { name: entityName },
    pause: !entityName,
  })

  const [query, setQuery] = useState('')

  useEffect(() => {
    if (fieldName) {
      // bottomSheet.current?.expand()
    } else {
      bottomSheet.current?.close()
    }
  }, [fieldName])

  const entity = data?.getEntityByName

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field: { onChange, value } }) => (
        <BottomSheet
          backgroundStyle={{ backgroundColor: theme.colors.background }}
          ref={bottomSheet}
          snapPoints={[80, 400]}
          keyboardBehavior='interactive'
          keyboardBlurBehavior='restore'
        >
          <Text>{fieldName}</Text>
          <Searchbar value={query} onChangeText={setQuery} placeholder='Search for entity..' />
          <ScrollView>
            {entity ? (
              <SearchEntries
                entityName={entityName}
                query={query}
                pluralizedName={entity.pluralizedName}
                fields={entity.fields}
                onSelected={(entry) => {
                  onChange(entry.id)
                }}
              />
            ) : null}
          </ScrollView>
        </BottomSheet>
      )}
    />
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

    console.log('mappedValues onSubmit', mappedValues)

    await createEntry(mappedValues)

    onUpdated?.()
  }, [createEntry, fields, onUpdated]))

  const [fieldForEntitySelection, setFieldForEntity] = useState<Field | null>(null)

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
              return <Button onPress={() => { setFieldForEntity(field) }} key={field.name}>Relation input here</Button>
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
      {
        fieldForEntitySelection ? (
          <SelectEntityRelation
            control={control}
            fieldName={fieldForEntitySelection.name}
            entityName={'entityName' in fieldForEntitySelection ? fieldForEntitySelection.entityName as string : ''}
          />
        ) : null
      }
    </View>
  )
}

export default UpsertEntry
