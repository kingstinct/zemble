import {
  Text, StyleSheet,
} from 'react-native'
import { DataTable } from 'react-native-paper'
import { useQuery } from 'urql'

import { capitalize } from '../utils/text'
import getSelectionSet from '../utils/getSelectionSet'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', 
    borderColor: 'gray', 
    borderWidth: StyleSheet.hairlineWidth, 
    margin: 10, 
    padding: 10, 
    justifyContent: 'space-between',
  },
  cell: { alignSelf: 'stretch' },
  table: { borderRadius: 10, margin: 10, padding: 10 },
})

type ListOfEntriesProps = {
  readonly pluralizedName: string,
  readonly fields: readonly {readonly name: string, readonly __typename: string, readonly availableFields?: readonly {readonly name: string}[]}[],
  readonly onSelected: (s: Record<string, unknown>) => void
  readonly entityName: string
}

const formatFieldValue = (value: unknown) => {
  if(value === null){
    return '(null)'
  }

  if(value === undefined || typeof value === 'undefined'){
    return '(undefined)'
  }

  if(typeof value === 'boolean'){
    return value ? '✅' : '❌'
  }

  return value.toString();
}

const ListOfEntries: React.FC<ListOfEntriesProps> = ({
  fields, pluralizedName, entityName, onSelected,
}) => {
  const selectionSet = getSelectionSet(entityName, fields)

  const queryName = `getAll${capitalize(pluralizedName)}`

  const [{ data }] = useQuery({
    query: `query GetEntries { ${queryName} { ${selectionSet.join(' ')} } }`,
    variables: {},
  })

  const entries = data?.[queryName] as Record<string, unknown> & readonly {readonly id: string}[] | undefined

  const fieldsExceptId = fields.filter(f => f.name !== 'id').map(f => f.name)

  return (
    <DataTable>

      <DataTable.Header>
        { fieldsExceptId.map((fieldName) => <DataTable.Title 
          key={fieldName}
        >{ fieldName }</DataTable.Title>) }
      </DataTable.Header>
      {
        entries?.map((entry) => (
          <DataTable.Row key={entry.id} onPress={() => onSelected(entry)}>
            { fieldsExceptId.map((fieldName) => (
              <DataTable.Cell key={fieldName}>
                <Text>
                  { formatFieldValue(entry[fieldName]) }
                </Text>
              </DataTable.Cell>
            )) }
          </DataTable.Row>
        ))
      }
    </DataTable>
  )
}

export default ListOfEntries
