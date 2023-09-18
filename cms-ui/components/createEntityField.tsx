/* eslint-disable no-nested-ternary */
/* eslint-disable functional/immutable-data */

import { useBottomSheet } from '@gorhom/bottom-sheet'
import { Formik } from 'formik'
import {
  View, Text, Button, TextInput, Switch,
} from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { useMutation } from 'urql'

import { graphql } from '../gql'
import { styles } from '../style'

import type { FieldInput } from '../gql/graphql'

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

const CreateField: React.FC<Props> = ({ entityName, onUpdated }) => {
  const [, createField] = useMutation(AddFieldsToEntityMutation)
  const { close } = useBottomSheet()

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
        if (values.fieldName === '' || values.fieldName === undefined) {
          return { fieldName: 'FieldName is required' }
        }
        return {}
      }}
      onSubmit={async (values) => {
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
          <Text style={styles.title}>{ `Add field to ${entityName} schema` }</Text>
          <TextInput
            accessibilityHint='Name of field'
            accessibilityLabel='Name of field'
            onBlur={handleBlur('fieldName')}
            placeholder='Name of field (required)'
            style={styles.textInputStyle}
            placeholderTextColor={errors.fieldName ? 'red' : 'black'}
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
            onSelect={handleChange('fieldType')}
            rowTextForSelection={(item) => item}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
          />
          <View style={styles.booleanFieldInput}>
            <Text>
              Required
            </Text>
            <Switch
              accessibilityHint='Is field required'
              accessibilityLabel='Is field required'
              value={JSON.parse(values.isRequired)}
              style={styles.booleanFieldSwitch}
              onValueChange={(e) => handleChange('isRequired')(e.toString())}
            />
          </View>

          <View style={styles.booleanFieldInput}>
            <Text>
              Required Input
            </Text>
            <Switch
              accessibilityHint='Is field required on input'
              accessibilityLabel='Is field required on input'
              value={JSON.parse(values.isRequiredInput)}
              style={styles.booleanFieldSwitch}
              onValueChange={(e) => handleChange('isRequiredInput')(e.toString())}
            />
          </View>

          { values.fieldType === 'BooleanField' ? (
            <View style={styles.booleanFieldInput}>
              <Text>
                Default Value
              </Text>
              <Switch
                accessibilityHint='Default Value'
                accessibilityLabel='Default Value'
                style={styles.booleanFieldSwitch}
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
              style={styles.textInputStyle}
              placeholderTextColor={errors.defaultValue ? 'red' : 'black'}
              keyboardType={values.fieldType === 'NumberField' ? 'numeric' : 'default'}
              onChangeText={handleChange('defaultValue')}
              value={values.defaultValue as string}
            />
          ) : null)}

          <View style={{ padding: 8 }}>
            { Object.keys(errors).map((key) => <Text key={key} style={{ color: 'red' }}>{errors[key]}</Text>) }
            <Button
              onPress={handleSubmit as () => void}
              title='Save'
            />
          </View>
          <View style={{ padding: 8 }}>
            <Button
              onPress={() => {
                close()
              }}
              title='Dismiss'
            />
          </View>
        </View>
      )}

    </Formik>
  )
}

export default CreateField
