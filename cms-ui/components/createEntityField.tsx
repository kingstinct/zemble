/* eslint-disable no-nested-ternary */
/* eslint-disable functional/immutable-data */

import { Formik } from 'formik'
import {
  View, Text, Button, TextInput, Switch,
} from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { useMutation } from 'urql'

import { graphql } from '../gql'

import type { FieldInput } from '../gql/graphql'

const AddFieldsToEntityMutation = graphql(`
  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {
    addFieldsToEntity(entityName: $name, fields: $fields) {
      name
    }
  }
`)

type FieldType = 'BooleanField' | 'StringField' | 'NumberField' | 'EntityRelationField' | 'ArrayField'

const CreateField: React.FC<{readonly entityName: string, readonly onUpdated?: () => void}> = ({ entityName, onUpdated }) => {
  const [, createField] = useMutation(AddFieldsToEntityMutation)

  return (
    <Formik
      initialValues={{
        fieldName: '',
        isRequired: 'false',
        isRequiredInput: 'false',
        fieldType: 'StringField' as FieldType,
        defaultValue: '',
      }}
      validate={(values) => {
        console.log({ values })
        if (values.fieldName === '' || values.fieldName === undefined) {
          return { fieldName: 'Required' }
        }
        return {}
      }}
      onSubmit={async (values) => {
        console.log({ values })

        const { fieldType, defaultValue } = values

        // eslint-disable-next-line unicorn/no-nested-ternary
        const defaultValueParsed = defaultValue === ''
          ? null
          : (fieldType === 'BooleanField'
            // eslint-disable-next-line unicorn/no-nested-ternary
            ? JSON.parse(defaultValue) : fieldType === 'NumberField'
              ? parseFloat(defaultValue) : defaultValue)

        const field = {
          [fieldType]: {
            name: values.fieldName,
            isRequired: JSON.parse(values.isRequired),
            isRequiredInput: JSON.parse(values.isRequiredInput),
            defaultValue: defaultValueParsed,
          },
        } as unknown as FieldInput

        await createField({
          name: entityName,
          fields: [field],
        })
        onUpdated?.()
      }}
    >
      {({
        handleChange, handleBlur, handleSubmit, values, errors,
      }) => (
        <View>
          <Text>{ `Add field to ${entityName} schema` }</Text>
          <TextInput
            accessibilityHint='Name of field'
            accessibilityLabel='Name of field'
            onBlur={handleBlur('fieldName')}
            placeholder='Name of field'
            onChangeText={handleChange('fieldName')}
            value={values.fieldName as string}
          />
          <SelectDropdown
            data={[
              'BooleanField',
              'StringField',
              'NumberField',
            ]}
            defaultValue={values.fieldType}
            onSelect={(selectedItem) => {
              handleChange('fieldType')(selectedItem)
            }}
            rowTextForSelection={(item) => item}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
          />
          <View style={{ flexDirection: 'row' }}>
            <Text>
              Required
            </Text>
            <Switch
              accessibilityHint='Is field required'
              accessibilityLabel='Is field required'
              value={JSON.parse(values.isRequired)}
              onValueChange={(e) => handleChange('isRequired')(e.toString())}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text>
              Required Input
            </Text>
            <Switch
              accessibilityHint='Is field required on input'
              accessibilityLabel='Is field required on input'
              value={JSON.parse(values.isRequiredInput)}
              onValueChange={(e) => handleChange('isRequiredInput')(e.toString())}
            />
          </View>

          { values.fieldType === 'BooleanField' ? (
            <View style={{ flexDirection: 'row' }}>
              <Text>
                Default Value
              </Text>
              <Switch
                accessibilityHint='Default Value'
                accessibilityLabel='Default Value'
                value={values.defaultValue ? JSON.parse(values.defaultValue) : false}
                onValueChange={(e) => {
                  handleChange('defaultValue')(e.toString())
                }}
              />
            </View>
          ) : (values.fieldType === 'StringField' || values.fieldType === 'NumberField' ? (
            <TextInput
              accessibilityHint='Default Value'
              accessibilityLabel='Default Value'
              onBlur={handleBlur('defaultValue')}
              placeholder='Default Value'
              keyboardType={values.fieldType === 'NumberField' ? 'numeric' : 'default'}
              onChangeText={handleChange('defaultValue')}
              value={values.defaultValue as string}
            />
          ) : null)}
          <Button
            onPress={handleSubmit as () => void}
            title='Save'
          />
        </View>
      )}

    </Formik>
  )
}

export default CreateField
