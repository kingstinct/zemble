import BottomSheet from '@gorhom/bottom-sheet'
import { Styles } from '@kingstinct/react'
import { useCallback, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Button, DataTable, Divider, Title, useTheme, Text,
} from 'react-native-paper'
import { useMutation } from 'urql'

import SelectOneController from './SelectOneControl'
import SwitchControl from './SwitchControl'
import TextControl, { TextControlInBottomSheet } from './TextControl'
import { graphql } from '../gql'

import type { FieldInput, FieldInputWithoutArray } from '../gql/graphql'
import type { Entity } from '../utils/getSelectionSet'

const AddFieldsToEntityMutation = graphql(`
  mutation AddFieldsToEntity($namePlural: String!, $fields: [FieldInput!]!) {
    addFieldsToEntity(namePlural: $namePlural, fields: $fields) {
      namePlural
    }
  }
`)

const RemoveFieldsFromEntityMutation = graphql(`
  mutation RemoveFieldsFromEntity($namePlural: String!, $fields: [String!]!) {
    removeFieldsFromEntity(namePlural: $namePlural, fields: $fields) {
      namePlural
      fields {
        __typename
        name
      }
    }
  }
`)

type FieldType = 'BooleanField' | 'StringField' | 'NumberField' | 'EntityRelationField' | 'ArrayField'

type FieldTypeWithoutArray = Exclude<FieldType, 'ArrayField'>

type Props = {
  readonly entity: Entity,
  readonly onUpdated?: () => void
  readonly fieldNameToModify?: string
  readonly availableEntityNames: readonly string[]
}

type UpsertFieldProps = {
  readonly updateField: (fieldInput: FieldInput) => void
  readonly availableEntityNames: readonly string[]
}

const CreateArrayField: React.FC<UpsertFieldProps> = ({ updateField, availableEntityNames }) => {
  const {
    control, handleSubmit, setValue, formState: { errors }, watch,
  } = useForm({
    defaultValues: {
      fieldName: '',
      fieldType: 'StringField' as FieldTypeWithoutArray,
      entityNamePlural: availableEntityNames[0],
    },
  })

  const fieldType = watch('fieldType')

  const onSubmit = handleSubmit(useCallback((values) => {
    const { fieldType } = values

    const field = {
      [fieldType]: {
        name: values.fieldName,
        isRequired: true,
        isRequiredInput: true,
        ...fieldType === 'EntityRelationField' ? {
          entityNamePlural: values.entityNamePlural,
        } : {},
      } as FieldInput[FieldType],
    } as unknown as FieldInput

    updateField(field)
    setValue('fieldName', '')
  }, [updateField, setValue]))

  return (
    <View style={Styles.margin8}>
      <Title style={{ textAlign: 'center' }}>Add field to array</Title>
      <Divider style={Styles.margin16} />
      <TextControlInBottomSheet
        label='Name of array field'
        control={control}
        name='fieldName'
        autoCapitalize='none'
        autoComplete='off'
        importantForAutofill='no'
        autoCorrect={false}
        rules={{ required: true, minLength: 1 }}
        returnKeyType='done'
      />
      <SelectOneController
        control={control}
        name='fieldType'
        options={[
          'BooleanField', 'StringField', 'NumberField', 'EntityRelationField',
        ]}
        rules={{ required: true }}
        buttonStyle={Styles.margin8}
      />
      { fieldType === 'EntityRelationField' ? (
        <SelectOneController
          control={control}
          name='entityNamePlural'
          options={availableEntityNames}
        />

      ) : null }
      { Object.keys(errors).map((key) => <Text key={key} style={{ color: 'red' }}>{JSON.stringify(errors[key])}</Text>) }

      <Button
        onPress={onSubmit}
        mode='contained'
        style={Styles.margin8}
      >
        Save
      </Button>
    </View>
  )
}

const UpsertField: React.FC<Props> = ({
  entity, onUpdated, fieldNameToModify, availableEntityNames,
}) => {
  const { namePlural } = entity
  const [, upsertField] = useMutation(AddFieldsToEntityMutation)
  const [, removeField] = useMutation(RemoveFieldsFromEntityMutation)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      fieldName: '',
      isRequired: false,
      isSearchable: true,
      fieldType: 'StringField' as FieldType,
      availableFields: [] as readonly FieldInputWithoutArray[],
      defaultValue: null as string | number | boolean | null | undefined,
      entityNamePlural: namePlural,
    },
  })

  const onDelete = useCallback(async () => {
    await removeField({
      namePlural,
      fields: [fieldNameToModify!],
    })
    onUpdated?.()
  }, [
    namePlural, fieldNameToModify, onUpdated, removeField,
  ])

  useEffect(() => {
    if (fieldNameToModify) {
      const field = entity.fields.find((f) => f.name === fieldNameToModify)
      if (field) {
        setValue('fieldName', field.name)
        setValue('fieldType', field.__typename as FieldType)
        setValue('isRequired', field.isRequired)
        if (field.__typename === 'StringField') {
          setValue('defaultValue', field.defaultValueString)
          setValue('isSearchable', field.isSearchable)
        }
        if (field.__typename === 'NumberField') {
          setValue('defaultValue', field.defaultValueNumber)
        }
        if (field.__typename === 'BooleanField') {
          setValue('defaultValue', field.defaultValueBoolean)
        }
        if (field.__typename === 'EntityRelationField') {
          setValue('entityNamePlural', field.entityNamePlural)
        }
        if (field.__typename === 'ArrayField') {
          setValue('availableFields', field.availableFields.map((f) => ({ [f.__typename]: { name: f.name } } as unknown as FieldInputWithoutArray)))
        }
      }
    }
  }, [entity.fields, fieldNameToModify, setValue])

  const fieldType = watch('fieldType')
  const onSubmit = handleSubmit(async (values) => {
    const { fieldType, defaultValue } = values

    const field = {
      [fieldType]: fieldType === 'EntityRelationField' ? {
        name: values.fieldName,
        isRequired: values.isRequired,
        entityNamePlural: values.entityNamePlural,
      } : (fieldType === 'ArrayField' ? {
        name: values.fieldName,
        isRequired: values.isRequired,
        isRequiredInput: values.isRequired,
        availableFields: values.availableFields,
      } : {
        name: values.fieldName,
        isRequired: values.isRequired,
        isRequiredInput: values.isRequired && !defaultValue,
        defaultValue,

        ...fieldType === 'StringField' ? {
          isSearchable: values.isSearchable,
        } : {},
      }),
    } as unknown as FieldInput

    const res = await upsertField({
      namePlural,
      fields: [field],
    })
    if (!res.error) {
      onUpdated?.()
    }
  })

  const bottomSheet = useRef<BottomSheet>(null)

  const theme = useTheme()

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1, margin: 16 }}>
        <SelectOneController
          control={control}
          name='fieldType'
          options={[
            'BooleanField', 'StringField', 'NumberField', 'EntityRelationField', 'ArrayField',
          ]}
          rules={{ required: true }}
        />

        <TextControl
          name='fieldName'
          autoCapitalize='none'
          autoComplete='off'
          autoFocus
          autoCorrect={false}
          control={control}
          importantForAutofill='no'
          label='Name of field'
          rules={{ required: true, pattern: /^[^-\s\d][^-\s]+$/ }}
        />

        { fieldType === 'BooleanField' ? (
          <SwitchControl
            control={control}
            label='Default Value'
            name='defaultValue'
          />
        ) : (fieldType === 'StringField' || fieldType === 'NumberField' ? (
          <TextControl
            label='Default Value'
            control={control}
            name='defaultValue'
            keyboardType={fieldType === 'NumberField' ? 'numeric' : 'default'}
          />
        ) : null)}

        { fieldType !== 'ArrayField' ? (
          <SwitchControl
            control={control}
            label='Required'
            name='isRequired'
          />
        ) : null }

        { fieldType === 'StringField' ? (
          <SwitchControl
            control={control}
            label='Searchable'
            name='isSearchable'
          />
        ) : null }

        { fieldType === 'EntityRelationField' ? (
          <SelectOneController
            control={control}
            name='entityNamePlural'
            options={availableEntityNames}
          />

        ) : null }

        {
          fieldType === 'ArrayField' && watch('availableFields').length > 0 ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Type</DataTable.Title>
              </DataTable.Header>
              {watch('availableFields').map((field) => {
                const type = Object.keys(field)[0] as 'BooleanField' | 'StringField' | 'NumberField' | 'EntityRelationField'
                const value = field[type]!
                return (
                  <DataTable.Row key={value.name}>
                    <DataTable.Cell><Text>{value.name}</Text></DataTable.Cell>
                    <DataTable.Cell><Text>{type}</Text></DataTable.Cell>
                  </DataTable.Row>
                )
              })}
            </DataTable>
          ) : null
        }
        {
          fieldType === 'ArrayField' ? (
            <Button mode='outlined' style={Styles.margin16} onPress={() => bottomSheet.current?.expand()}>Add field to array</Button>
          ) : null

        }

        { Object.keys(errors).map((key) => <Text key={key} style={{ color: 'red' }}>{JSON.stringify(errors[key])}</Text>) }
        <Button
          onPress={onSubmit}
          mode='contained'
          style={Styles.marginVertical8}
        >
          Save
        </Button>
        { fieldNameToModify ? (
          <Button
            onPress={onDelete}
            mode='outlined'
            style={Styles.marginVertical8}
          >
            Delete field
          </Button>
        ) : null }

      </ScrollView>
      {
        fieldType === 'ArrayField' ? (
          <Controller
            control={control}
            name='availableFields'
            rules={{ required: true, minLength: 1 }}
            render={({ field: { onChange, value } }) => (
              <BottomSheet
                backgroundStyle={{ backgroundColor: theme.colors.background }}
                ref={bottomSheet}
                snapPoints={[80, 400]}
                keyboardBehavior='interactive'
                keyboardBlurBehavior='restore'
              >
                <CreateArrayField
                  availableEntityNames={availableEntityNames}
                  updateField={(field) => {
                    bottomSheet.current?.collapse()
                    onChange([
                      ...value.filter((a) => {
                        const f = Object.values(a)[0] as {readonly name: string}
                        const f2 = Object.values(field)[0] as {readonly name: string}
                        return f.name !== f2.name
                      }),
                      field,
                    ])
                  }}
                />
              </BottomSheet>
            )}
          />
        ) : null
      }
    </View>

  )
}

export default UpsertField
