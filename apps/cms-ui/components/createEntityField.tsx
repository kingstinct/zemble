
import BottomSheet from '@gorhom/bottom-sheet';
import { Controller, useForm } from 'react-hook-form'
import {
  View, Text,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Button, DataTable, Divider, Title,
} from 'react-native-paper'
import { useMutation } from 'urql'

import { graphql } from '../gql'

import type { FieldInput, FieldInputWithoutArray } from '../gql/graphql'
import SwitchControl from './SwitchControl'
import SelectOneController from './SelectOneControl'
import TextControl, { TextControlInBottomSheet } from './TextControl'
import { Styles, styles } from '@kingstinct/react';
import { useRef } from 'react';

const AddFieldsToEntityMutation = graphql(`
  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {
    addFieldsToEntity(entityName: $name, fields: $fields) {
      name
    }
  }
`)

type FieldType = 'BooleanField' | 'StringField' | 'NumberField' | 'EntityRelationField' | 'ArrayField'

type Props = {
  readonly entityName: string,
  readonly onUpdated?: () => void
}

type CreateFieldProps = {
  readonly updateField: (fieldInput: FieldInput) => void
}

const CreateArrayField: React.FC<CreateFieldProps> = ({ updateField }) => {
  const { control, watch, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fieldName: '',
      fieldType: 'StringField' as Exclude<FieldType, 'ArrayField'>,
    },
  })

  const onSubmit = handleSubmit((values) => {
    const { fieldType } = values

    const field = {
      [fieldType]: {
        name: values.fieldName,
      },
    } as unknown as FieldInput

    updateField(field)
    setValue('fieldName', '')
  })

  return (
    <View style={Styles.margin8}>
      <Title style={{ textAlign: 'center' }}>Add field type to array</Title>
      <Divider style={Styles.margin16} />
      <TextControlInBottomSheet
        placeholder='Name of array field (required)'
        control={control}
        name='fieldName'
        rules={{ required: true, minLength: 1 }}
        keyboardType={watch('fieldType') === 'NumberField' ? 'numeric' : 'default'}
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


const CreateField: React.FC<Props> = ({ entityName, onUpdated }) => {
  const [, createField] = useMutation(AddFieldsToEntityMutation)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      fieldName: '',
      isRequired: false,
      fieldType: 'StringField' as FieldType,
      availableFields: [] as readonly FieldInputWithoutArray[],
      defaultValue: null as string | number | boolean | null,
    },
  })

  const fieldType = watch('fieldType')
  const onSubmit = handleSubmit(async (values) => {
    const { fieldType, defaultValue } = values

    const field = {
      [fieldType]: fieldType === 'ArrayField' ? {
        name: values.fieldName,
        isRequired: values.isRequired,
        isRequiredInput: values.isRequired,
        availableFields: values.availableFields,
      } : {
        name: values.fieldName,
        isRequired: values.isRequired,
        isRequiredInput: values.isRequired && !defaultValue,
        defaultValue,
      },
    } as unknown as FieldInput

    await createField({
      name: entityName,
      fields: [field],
    })
    onUpdated?.()
  })

  const bottomSheet = useRef<BottomSheet>(null)

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ flex: 1, margin: 16 }}>
      <TextControl 
      name='fieldName' control={control} label='Name of field (required)' rules={{ required: true }} />

      <SelectOneController
        control={control}
        name='fieldType'
        options={[
          'BooleanField', 'StringField', 'NumberField', 'EntityRelationField', 'ArrayField',
        ]}
        rules={{ required: true }}
      />

      { fieldType !== 'ArrayField' ? (
        <SwitchControl
          control={control}
          label='Is required'
          name='isRequired'
        />
      ) : null }

      { fieldType === 'EntityRelationField' ? (
        <Text>
          {`${fieldType}`}
        </Text>
      ) : null }

      { fieldType === 'BooleanField' ? (
        <SwitchControl
          control={control}
          label='Default Value'
          name='defaultValue'
        />
      ) : (fieldType === 'StringField' || fieldType === 'NumberField' ? (
        <TextControl
          placeholder='Default Value'
          control={control}
          name='defaultValue'
          keyboardType={fieldType === 'NumberField' ? 'numeric' : 'default'}
        />
      ) : null)}

{
        fieldType === 'ArrayField' ? (
          
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
                </DataTable>) : null
      }

      
        { Object.keys(errors).map((key) => <Text key={key} style={{ color: 'red' }}>{JSON.stringify(errors[key])}</Text>) }
        <Button
          onPress={onSubmit}
          mode='contained'
        >
          Save
        </Button>
      

    </ScrollView>
    {
      fieldType === 'ArrayField' ? (
        <Controller
          control={control}
          name='availableFields'
          rules={{ required: true, minLength: 1 }}
          render={({ field: { onChange, onBlur, value } }) => (
              <BottomSheet ref={bottomSheet} snapPoints={[80, 200, 500]} keyboardBehavior='interactive' keyboardBlurBehavior='restore'>
                <CreateArrayField updateField={(field) => {
                  bottomSheet.current?.collapse()
                  onChange([
                    ...value.filter((a) => {
                      const f = Object.values(a)[0] as {readonly name: string}
                      const f2 = Object.values(field)[0] as {readonly name: string}
                      console.log({ f, f2 })
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

export default CreateField
