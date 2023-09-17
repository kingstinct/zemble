/* eslint-disable functional/immutable-data */

import { Formik } from 'formik'
import { useMemo } from 'react'
import {
  View, Text, Button, TextInput, Switch,
} from 'react-native'
import { useMutation } from 'urql'

import { capitalize } from '../utils/text'

import type { GetEntityByPluralizedNameQuery } from '../gql/graphql'

const fieldToTypeMap: Record<string, string> = {
  StringField: 'String',
  NumberField: 'Float',
  BooleanField: 'Boolean',
  IDField: 'ID',
  // ArrayField: 'Array',
  // ObjectRelationField: 'Object',
}

type Entity = NonNullable<GetEntityByPluralizedNameQuery['getEntityByPluralizedName']>

const buildCreateEntryMutation = (entity: Entity) => {
  const { fields } = entity

  const mutationName = `create${capitalize(entity.name)}`

  const mutationInputVariables = fields.map((f) => (`$${f.name}: ${fieldToTypeMap[f.__typename]}${f.isRequired && f.name !== 'id' ? '!' : ''}`)).join(', ')

  const mutationVariables = fields.map((f) => `${f.name}: $${f.name}`).join(', ')

  const createEntryStr = `mutation CreateEntry(${mutationInputVariables}) 
  { ${mutationName}(${mutationVariables})
    { 
      id 
    } 
  }`

  console.log(createEntryStr)

  return createEntryStr
}

const CreateEntry: React.FC<{readonly entity: Entity, readonly onUpdated?: () => void}> = ({ entity, onUpdated }) => {
  console.log({ entity })

  const { fields } = entity

  const [, createEntry] = useMutation(useMemo(() => buildCreateEntryMutation(entity), [entity]))

  const defaults = fields.reduce((acc, field) => {
    // eslint-disable-next-line no-nested-ternary, functional/immutable-data, unicorn/no-nested-ternary
    acc[field.name as unknown as string] = (field.__typename === 'BooleanField' ? field.defaultValueBoolean : field.__typename === 'NumberField' ? field.defaultValueNumber : field.__typename === 'StringField' ? field.defaultValueString : '') ?? ''
    return acc
  }, {} as Record<string, unknown>)

  const validate = (values) => {
    /* if (!values.email) {
      errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    } */

    const errors = fields.reduce((acc, field) => {
      if (field.isRequired && values[field.name] === undefined && field.name !== '_id') {
        acc[field.name] = `${field.name} is required`
      }

      return acc
    }, {})

    console.log({ errors })

    return errors
  }

  return (
    <Formik
      initialValues={defaults}
      validate={validate}
      onSubmit={async (values) => {
        const mappedValues = fields.reduce((acc, field) => {
          if (field.__typename === 'BooleanField' && values[field.name] !== undefined && values[field.name] !== '') {
            acc[field.name] = JSON.parse(values[field.name])
          }
          return acc
        }, values)

        await createEntry(mappedValues)
        onUpdated?.()
      }}
    >
      {({
        handleChange, handleBlur, handleSubmit, values, errors,
      }) => (
        <View>
          <Text>{ `Create ${entity.name}` }</Text>
          {
            entity.fields.map((field) => {
              if (field.__typename === 'IDField' && values[field.name]) {
                return (
                  <Text
                    key={field.name}
                    accessibilityHint={field.name}
                    accessibilityLabel={field.name}
                  >
                    {`ID: ${values[field.name]}` as string}
                  </Text>
                )
              }
              if (field.__typename === 'StringField') {
                return (
                  <TextInput
                    key={field.name}
                    accessibilityHint={field.name}
                    accessibilityLabel={field.name}
                    onBlur={handleBlur(field.name)}
                    placeholder={field.name}
                    onChangeText={handleChange(field.name)}
                    value={values[field.name] as string}
                  />
                )
              }
              if (field.__typename === 'NumberField') {
                return (
                  <TextInput
                    key={field.name}
                    accessibilityHint={field.name}
                    accessibilityLabel={field.name}
                    placeholder={field.name}
                    keyboardType='numeric'
                    onBlur={handleBlur(field.name)}
                    value={values[field.name] as string}
                    onChangeText={handleChange(field.name)}
                  />
                )
              }
              if (field.__typename === 'BooleanField') {
                return (
                  <View key={field.name} style={{ flexDirection: 'row' }}>
                    <Text>
                      {field.name}
                    </Text>
                    <Switch
                      accessibilityHint={field.name}
                      accessibilityLabel={field.name}
                      value={values[field.name] || values[field.name] === false ? JSON.parse(values[field.name]) : false}
                      onValueChange={(e) => {
                        handleChange(field.name)(e.toString())
                      }}
                    />
                  </View>
                )
              }

              return null
            })
          }
          <Button
            onPress={handleSubmit as () => void}
            title='Save'
          />
        </View>
      )}

    </Formik>
  )
}

export default CreateEntry
