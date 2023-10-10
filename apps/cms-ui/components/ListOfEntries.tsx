import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import {
  Text,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { DataTable } from 'react-native-paper'
import { useQuery } from 'urql'

import ManualRefreshControl from './ManualRefreshControl'
import getSelectionSet from '../utils/getSelectionSet'
import { capitalize } from '../utils/text'

type ListOfEntriesProps = {
  readonly pluralizedName: string,
  readonly fields: readonly {readonly name: string, readonly __typename: string, readonly availableFields?: readonly {readonly name: string}[]}[],
  readonly onSelected: (s: Record<string, unknown> & { readonly id: string }) => void
  readonly entityName: string
}

const formatFieldValue = (value: unknown) => {
  if (value === null) {
    return '(null)'
  }

  if (value === undefined || typeof value === 'undefined') {
    return '(undefined)'
  }

  if (typeof value === 'boolean') {
    return value ? '✅' : '❌'
  }

  if (Array.isArray(value)) {
    return `${value.length.toString()} items`
  }

  return value.toString()
}

const ListOfEntries: React.FC<ListOfEntriesProps> = ({
  fields, pluralizedName, entityName, onSelected,
}) => {
  const selectionSet = getSelectionSet(entityName, fields)

  const queryName = `getAll${capitalize(pluralizedName)}`

  const [{ data, fetching }, refetch] = useQuery({
    query: `query GetEntries { ${queryName} { ${selectionSet.join(' ')} } }`,
    variables: {},
  })

  const entries = data?.[queryName] as Record<string, unknown> & readonly {readonly id: string}[] | undefined

  const fieldsExceptId = fields.filter((f) => f.name !== 'id')
  const fieldNamesExceptId = fieldsExceptId.map((f) => f.name)

  useFocusEffect(useCallback(() => {
    refetch()
  }, [refetch]))

  return (
    <ScrollView
      refreshControl={(
        <ManualRefreshControl
          fetching={fetching}
          refetch={refetch}
        />
      )}
      contentContainerStyle={{ flex: 1 }}
    >
      <DataTable>

        <DataTable.Header>
          { fieldNamesExceptId.map((fieldName) => (
            <DataTable.Title
              key={fieldName}
            >
              { fieldName }
            </DataTable.Title>
          )) }
        </DataTable.Header>
        {
          entries?.map((entry) => (
            <DataTable.Row key={entry.id} onPress={() => onSelected(entry)}>
              { fieldsExceptId.map((field) => (
                <DataTable.Cell key={field.name}>
                  <Text>
                    { formatFieldValue(entry[field.name]) }
                  </Text>
                </DataTable.Cell>
              )) }
            </DataTable.Row>
          ))
        }
      </DataTable>
    </ScrollView>
  )
}

export default ListOfEntries
