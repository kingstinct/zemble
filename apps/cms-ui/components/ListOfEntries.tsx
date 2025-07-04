import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { DataTable } from 'react-native-paper'
import { useQuery } from 'urql'
import type { Entity } from '../utils/getSelectionSet'
import getSelectionSet from '../utils/getSelectionSet'
import { capitalize } from '../utils/text'
import ManualRefreshControl from './ManualRefreshControl'

type ListOfEntriesProps = {
  readonly onSelected: (
    s: Record<string, unknown> & { readonly id: string },
  ) => void
  readonly entity: Entity
}

const formatFieldValue = (value: unknown): string => {
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

  if (typeof value === 'object' && 'displayName' in value) {
    return value.displayName as string
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return value.toString()
}

type ListOfEntriesTableProps = {
  readonly fields: readonly {
    readonly name: string
    readonly __typename: string
    readonly availableFields?: readonly { readonly name: string }[]
  }[]
  readonly onSelected: (
    s: Record<string, unknown> & { readonly id: string },
  ) => void
  readonly entries: Record<string, unknown> & readonly { readonly id: string }[]
}

const ListOfEntriesTable: React.FC<ListOfEntriesTableProps> = ({
  fields,
  entries,
  onSelected,
}) => {
  const fieldsExceptId = fields.filter((f) => f.name !== 'id')
  const fieldNamesExceptId = fieldsExceptId.map((f) => f.name)

  return (
    <DataTable>
      <DataTable.Header>
        {fieldNamesExceptId.map((fieldName) => (
          <DataTable.Title key={fieldName}>{fieldName}</DataTable.Title>
        ))}
      </DataTable.Header>
      {entries?.map((entry) => (
        <DataTable.Row key={entry.id} onPress={() => onSelected(entry)}>
          {fieldsExceptId.map((field) => (
            <DataTable.Cell key={field.name}>
              <Text>{formatFieldValue(entry[field.name])}</Text>
            </DataTable.Cell>
          ))}
        </DataTable.Row>
      ))}
    </DataTable>
  )
}

const ListOfEntries: React.FC<ListOfEntriesProps> = ({
  entity,
  onSelected,
}) => {
  const { namePlural, fields } = entity
  const selectionSet = getSelectionSet(entity)

  const queryName = `getAll${capitalize(namePlural)}`

  const [{ data, fetching }, refetch] = useQuery({
    query: `query GetEntries { ${queryName} { ${selectionSet.join(' ')} } }`,
    variables: {},
  })

  const entries = data?.[queryName] as
    | (Record<string, unknown> & readonly { readonly id: string }[])
    | undefined

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  return (
    <ScrollView
      refreshControl={
        <ManualRefreshControl fetching={fetching} refetch={refetch} />
      }
      contentContainerStyle={{ flex: 1 }}
    >
      {entries ? (
        <ListOfEntriesTable
          entries={entries}
          fields={fields}
          onSelected={onSelected}
        />
      ) : null}
    </ScrollView>
  )
}

type SearchEntriesProps = {
  readonly onSelected: (
    s: Record<string, unknown> & { readonly id: string },
  ) => void
  readonly query: string
  readonly entity: Entity
}

export const SearchEntries: React.FC<SearchEntriesProps> = ({
  onSelected,
  query,
  entity,
}) => {
  const selectionSet = getSelectionSet(entity)

  const queryName = `search${capitalize(entity.namePlural)}`

  const [{ data, fetching }, refetch] = useQuery({
    query: `query SearchEntries { ${queryName}(query: "${query}") { ${selectionSet.join(' ')} } }`,
    variables: {},
    pause: query.length < 3,
  })

  const entries = data?.[queryName] as
    | (Record<string, unknown> & readonly { readonly id: string }[])
    | undefined

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  return (
    <ScrollView
      refreshControl={
        <ManualRefreshControl fetching={fetching} refetch={refetch} />
      }
      contentContainerStyle={{ flex: 1 }}
    >
      {entries ? (
        <ListOfEntriesTable
          entries={entries}
          fields={entity.fields}
          onSelected={onSelected}
        />
      ) : query.length < 3 ? (
        <Text>Type at least 3 characters to search</Text>
      ) : null}
    </ScrollView>
  )
}

export default ListOfEntries
