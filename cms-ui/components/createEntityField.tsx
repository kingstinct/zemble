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

type CreateFieldProps = {
  readonly updateField: (fieldInput: FieldInput) => void
}

const CreateArrayField: React.FC<CreateFieldProps> = ({ updateField }) => (
  <Formik
    initialValues={{
      fieldName: '',
      fieldType: 'StringField' as FieldType,
    }}
    validate={(values) => {
      if (values.fieldName === '' || values.fieldName === undefined) {
        return { fieldName: 'FieldName is required' }
      }
      return {}
    }}
    onSubmit={(values) => {
      const { fieldType } = values

      const field = {
        [fieldType]: {
          name: values.fieldName,
        },
      } as unknown as FieldInput

      updateField(field)
    }}
  >
    {({
      handleChange, handleBlur, handleSubmit, values, errors,
    }) => (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              accessibilityHint='Name of array field'
              accessibilityLabel='Name of array field'
              onBlur={handleBlur('fieldName')}
              placeholder='Name of array field (required)'
              style={styles.textInputStyle}
              placeholderTextColor={errors.fieldName ? 'red' : 'black'}
              onChangeText={handleChange('fieldName')}
              value={values.fieldName as string}
            />
          </View>
        </View>
        <SelectDropdown
          data={[
            'BooleanField',
            'StringField',
            'NumberField',
            'EntityRelationField',
          ]}
          buttonStyle={{
            margin: 10, padding: 10, borderRadius: 10,
          }}
          defaultValue={values.fieldType}
          onSelect={handleChange('fieldType')}
          rowTextForSelection={(item) => item}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
        />

        <View style={{ padding: 8 }}>
          { Object.keys(errors).map((key) => <Text key={key} style={{ color: 'red' }}>{errors[key]}</Text>) }
          <Button
            onPress={handleSubmit as () => void}
            title='Save'
          />
        </View>
      </View>
    )}
  </Formik>
)

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
        availableFields: '[]',
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
          [fieldType]: fieldType === 'ArrayField' ? {
            name: values.fieldName,
            isRequired: JSON.parse(values.isRequired),
            isRequiredInput: JSON.parse(values.isRequiredInput),
            availableFields: JSON.parse(values.availableFields),
          } : {
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
              'EntityRelationField',
              'ArrayField',
            ]}
            buttonStyle={{
              flex: 1, margin: 10, padding: 10, borderRadius: 10,
            }}
            defaultValue={values.fieldType}
            onSelect={handleChange('fieldType')}
            rowTextForSelection={(item) => item}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
          />

          { values.fieldType !== 'ArrayField' ? (
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
          ) : null }

          { values.fieldType !== 'ArrayField' ? (
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
          ) : null }

          { values.fieldType === 'EntityRelationField' ? (
            <Text>
              {`${values.fieldType}`}
            </Text>
          ) : null }

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

          {
            values.fieldType === 'ArrayField' ? (
              <View>
                <Text>{ JSON.stringify(values.availableFields) }</Text>
                <CreateArrayField updateField={(field) => {
                // eslint-disable-next-line no-param-reassign
                  handleChange('availableFields')(JSON.stringify([
                    ...JSON.parse(values.availableFields).filter((a) => {
                      const f = Object.values(a)[0] as {readonly name: string}
                      const f2 = Object.values(field)[0] as {readonly name: string}
                      console.log({ f, f2 })
                      return f.name !== f2.name
                    }),
                    field,
                  ]))
                }}
                />
              </View>
            ) : null
          }

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
